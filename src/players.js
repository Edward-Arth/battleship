const gameBoardModule = require('./gameboard');

const Gameboard = gameBoardModule.class;

class Player {
  constructor() {
    this.newGrid = function newGrid() {
      const newBoard = new Gameboard();
      return newBoard;
    };
    this.grid = this.newGrid();
    const playerGrid = this.grid;
    this.placeShip = function placeShip(length, [startRow, startColumn], orientation) {
      playerGrid.placeShip(length, [startRow, startColumn], orientation);
    };
    this.receiveAttack = function receiveAttack([row, column]) {
      const gotHit = playerGrid.receiveAttack([row, column]);
      return gotHit;
    };
    this.attack = function attack(otherPlayer, [row, column]) {
      const hitOrMiss = otherPlayer.receiveAttack([row, column]);
      if (hitOrMiss === 'Miss!') {
        playerGrid.missedAttacks.push([row, column]);
      } else {
        playerGrid.successfulAttacks.push([row, column]);
      }
      return hitOrMiss;
    };
    const passableAttack = this.attack;
    this.computerShipDamage = [];
    const { computerShipDamage } = this;
    this.computerOriginalHit = [];
    const { computerOriginalHit } = this;
    this.computerAttack = function computerAttack(humanPlayer) {
      function randomSelect() {
        return Math.floor(Math.random() * 10);
      }
      function attackRepeat() {
        const randomSpace = [randomSelect(), randomSelect()];
        // eslint-disable-next-line max-len
        if (playerGrid.missedAttacks.some((arr) => arr.every((val, index) => val === randomSpace[index]))) {
          attackRepeat();
        // eslint-disable-next-line max-len
        } else if (playerGrid.successfulAttacks.some((arr) => arr.every((val, index) => val === randomSpace[index]))) {
          attackRepeat();
        } else {
          const randomAttack = passableAttack(humanPlayer, randomSpace);
          if (randomAttack === 'Hit & ship still afloat!') {
            playerGrid.successfulAttacks.push(randomSpace);
            computerOriginalHit.push(randomSpace);
            computerShipDamage.push(
              [randomSpace[0] + 1, randomSpace[1]],
              [randomSpace[0] - 1, randomSpace[1]],
              [randomSpace[0], randomSpace[1] + 1],
              [randomSpace[0], randomSpace[1] - 1],
            );
            for (let i = 0; i < computerShipDamage.length; i += 1) {
              const rowNumber = computerShipDamage[i][0];
              const colNumber = computerShipDamage[i][1];
              if (rowNumber > 9 || rowNumber < 0 || colNumber > 9 || colNumber < 0) {
                computerShipDamage.splice(i, 1);
              }
            }
          }
        }
      }
      function attackDamagedShip() {
        const newTarget = computerShipDamage.slice(-1)[0];
        computerShipDamage.splice(-1, 1);
        const attemptAttack = passableAttack(humanPlayer, newTarget);
        if (attemptAttack === 'Hit & ship still afloat!') {
          playerGrid.successfulAttacks.push(newTarget);
          const rowDiff = newTarget[0] - computerOriginalHit[0][0];
          const colDiff = newTarget[1] - computerOriginalHit[0][1];
          if (rowDiff === 1) {
            computerShipDamage.push([newTarget[0] + 1, newTarget[1]]);
          } else if (rowDiff === -1) {
            computerShipDamage.push([newTarget[0] - 1, newTarget[1]]);
          } else if (colDiff === 1) {
            computerShipDamage.push([newTarget[0], newTarget[1] + 1]);
          } else if (colDiff === -1) {
            computerShipDamage.push([newTarget[0], newTarget[1] - 1]);
          }
          const checkIfPriorMiss = computerShipDamage.slice(-1);
          // eslint-disable-next-line max-len
          if (playerGrid.missedAttacks.some((arr) => arr.every((val, index) => val === checkIfPriorMiss[index]))) {
            computerShipDamage.splice(-1, 1);
          // eslint-disable-next-line max-len
          } else if (playerGrid.successfulAttacks.some((arr) => arr.every((val, index) => val === checkIfPriorMiss[index]))) {
            computerShipDamage.splice(-1, 1);
          }
        } else if (attemptAttack === 'Hit & ship sunk!') {
          playerGrid.successfulAttacks.push(newTarget);
          computerShipDamage.length = 0;
          computerOriginalHit.length = 0;
        }
      }
      if (computerShipDamage.length === 0) {
        attackRepeat();
      } else {
        attackDamagedShip();
      }
    };
  }
}

const player1 = new Player();
const player2 = new Player();
player1.newGrid();
player2.newGrid();

player1.placeShip(3, [0, 0], 'horizontal');

player1.receiveAttack([0, 0]);

player2.computerShipDamage.push([1, 0], [0, 1]);
player2.computerOriginalHit.push([0, 0]);

player2.computerAttack(player1);
player2.computerAttack(player1);
player2.computerAttack(player1);

exports.class = Player;
exports.mockObject = player1;
exports.mockComputer = player2;
