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
    const passableHits = this.missedHits;
    const passableSquares = this.squares;
    this.placeShip = function placeShip(length, [startRow, startColumn], orientation) {
      const newShip = new Ship(length);
      function shipSplice(start) {
        if (orientation === 'horizontal') {
          if (start === startColumn + length) {
            const staticRow = passableSquares[startRow];
            staticRow.splice(start, 1, 'newShip');
            return;
          }
          const staticRow = passableSquares[startRow];
          staticRow.splice(start, 1, 'newShip');
          shipSplice(start + 1);
        } else {
          if (start === startRow + length) {
            const nonStaticRow = passableSquares[start];
            nonStaticRow.splice(startColumn, 1, newShip);
            return;
          }
          const nonStaticRow = passableSquares[start];
          nonStaticRow.splice(startColumn, 1, newShip);
          shipSplice(start + 1);
        }
      }
      if (orientation === 'horizontal' && startColumn + length < 10) {
        shipSplice(startColumn);
      } else if (orientation === 'horizontal' && startColumn + length > 10) {
        return 'Ship is too long for this space!';
      } else if (orientation === 'vertical' && startRow + length < 10) {
        shipSplice(startRow);
      } else if (orientation === 'vertical' && startRow + length > 10) {
        return 'Ship is too long for this space!';
      }
      return this.squares;
    };
    this.receiveAttack = function receiveAttack([row, column]) {
      const attackedSquare = passableSquares[row][column];
      if (attackedSquare === column + 1) {
        passableHits.push([row, column]);
      } else {
        attackedSquare.hit();
      }
      return passableHits && passableSquares;
    };
  }
}

const mockBoard = new Gameboard();

mockBoard.placeShip(5, [2, 3], 'vertical');

mockBoard.receiveAttack([3, 3]);
mockBoard.receiveAttack([9, 9]);

exports.class = Gameboard;
exports.mockObject = mockBoard;

// write in different ship types, and gameboard "armada" that keeps track of ships
// and function to loop through armada checking for sunk ships
