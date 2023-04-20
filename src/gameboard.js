const shipModule = require('./ship');

const Ship = shipModule.class;

class Gameboard {
  constructor() {
    this.squares = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ];
    this.missedHits = [];
    this.missedAttacks = [];
    this.successfulAttacks = [];
    this.armada = [];
    this.armadaSpaces = [];
    const passableArmadaSpaces = this.armadaSpaces;
    const passableArmada = this.armada;
    const passableHits = this.missedHits;
    const passableSquares = this.squares;
    this.placeShip = function placeShip(length, [startRow, startColumn], orientation) {
      if (orientation === 'horizontal') {
        if (startColumn + length > 10) {
          return;
        }
        const shipSpaces = [];
        let variableSpace = startColumn;
        for (let i = 0; i < length; i += 1) {
          shipSpaces.push([startRow, variableSpace]);
          variableSpace += 1;
        }
        if (passableArmadaSpaces.length !== 0) {
          for (let i = 0; i < shipSpaces.length; i += 1) {
            // eslint-disable-next-line max-len
            if (passableArmadaSpaces.some((arr) => arr.every((val, index) => val === shipSpaces[i][index]))) {
              return;
            }
          }
        }
        const newShip = new Ship(length);
        passableArmada.push(newShip);
        for (let i = 0; i < shipSpaces.length; i += 1) {
          passableSquares[startRow].splice(startColumn + i, 1, newShip);
          passableArmadaSpaces.push([startRow, startColumn + i]);
        }
      } else {
        if (startRow + length > 10) {
          return;
        }
        const shipSpaces = [];
        let variableSpace = startRow;
        for (let i = 0; i < length; i += 1) {
          shipSpaces.push([variableSpace, startColumn]);
          variableSpace += 1;
        }
        if (passableArmadaSpaces.length !== 0) {
          for (let i = 0; i < shipSpaces.length; i += 1) {
            // eslint-disable-next-line max-len
            if (passableArmadaSpaces.some((arr) => arr.every((val, index) => val === shipSpaces[i][index]))) {
              return;
            }
          }
        }
        const newShip = new Ship(length);
        passableArmada.push(newShip);
        let variableRow = startRow;
        for (let i = 0; i < shipSpaces.length; i += 1) {
          passableSquares[variableRow].splice(startColumn, 1, newShip);
          passableArmadaSpaces.push([variableRow, startColumn]);
          variableRow += 1;
        }
      }
    };
    this.receiveAttack = function receiveAttack([row, column]) {
      const attackedSquare = passableSquares[row][column];
      if (attackedSquare === column + 1) {
        passableHits.push([row, column]);
        return 'Miss!';
      }
      const hitReturn = attackedSquare.hit();
      if (hitReturn === true) {
        return 'Hit & ship sunk!';
      }
      return 'Hit & ship still afloat!';
    };
    this.checkFleet = function checkFleet() {
      for (let i = 0; i < passableArmada.length; i += 1) {
        const isSunk = passableArmada[i].isSunk();
        if (isSunk === false) {
          return false;
        }
      }
      return true;
    };
  }
}

const mockBoard = new Gameboard();

mockBoard.placeShip(5, [2, 3], 'vertical');

mockBoard.receiveAttack([3, 3]);
mockBoard.receiveAttack([2, 3]);
mockBoard.receiveAttack([4, 3]);
mockBoard.receiveAttack([5, 3]);
mockBoard.receiveAttack([6, 3]);

mockBoard.receiveAttack([9, 9]);

mockBoard.placeShip(2, [8, 8], 'horizontal');
mockBoard.placeShip(2, [7, 8], 'vertical');

exports.class = Gameboard;
exports.mockObject = mockBoard;
