/* eslint-disable no-loop-func */
const playersModule = require('./players');

const Player = playersModule.class;

function buildGame() {
  const player1 = new Player();
  const player2 = new Player(player1);
  player1.newGrid();
  player2.newGrid();

  const player1Board = document.getElementById('yourBoard');
  const player2Board = document.getElementById('enemyBoard');
  const placementBoard = document.getElementById('placementBoard');
  const placeShipGrid = document.getElementById('placeShipGrid');
  const sunkNotif = document.getElementById('sunkNotif');
  const sunkNotif2 = document.getElementById('sunkNotif2');
  const startGame = document.getElementById('startGame');
  const instructions = document.getElementById('instructions2');
  const winDeclaration = document.getElementById('winDeclaration');
  const loseDeclaration = document.getElementById('loseDeclaration');
  const restartButt = document.getElementsByClassName('restart');

  for (let i = 0; i < 2; i += 1) {
    restartButt[i].addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    });
  }

  function removeSunk() {
    sunkNotif.style.display = 'none';
  }

  function removeSunk2() {
    sunkNotif2.style.display = 'none';
  }

  function buildPlayerBoards() {
    player1Board.style.display = 'flex';
    player2Board.style.display = 'flex';
    instructions.style.display = 'block';
    for (let i = 0; i < 10; i += 1) {
      for (let p = 0; p < 10; p += 1) {
        const gridNode = document.createElement('div');
        gridNode.id = `playerNode${i},${p}`;
        player1Board.appendChild(gridNode);
        gridNode.style.width = '50px';
        gridNode.style.height = '50px';
        gridNode.style.outlineColor = 'black';
        gridNode.style.outlineStyle = 'solid';
        gridNode.style.outlineWidth = '1px';
        if (player1.grid.squares[i][p].length >= 2) {
          gridNode.style.backgroundColor = 'green';
        }
      }
    }
    for (let i = 0; i < 10; i += 1) {
      for (let p = 0; p < 10; p += 1) {
        const gridNode = document.createElement('div');
        player2Board.appendChild(gridNode);
        gridNode.id = `computerNode${i},${p}`;
        gridNode.style.width = '50px';
        gridNode.style.height = '50px';
        gridNode.style.outlineColor = 'black';
        gridNode.style.outlineStyle = 'solid';
        gridNode.style.outlineWidth = '1px';
        gridNode.addEventListener('click', () => {
          const colourOnHit = player1.attack(player2, [i, p]);
          if (colourOnHit === 'Miss!') {
            gridNode.style.backgroundColor = 'gray';
          } else if (colourOnHit === 'Hit & ship sunk!') {
            gridNode.style.backgroundColor = 'red';
            sunkNotif.style.display = 'flex';
            setTimeout(removeSunk, 2000);
          } else {
            gridNode.style.backgroundColor = 'red';
          }
          const checkWin = player2.grid.checkFleet();
          if (checkWin === false) {
            const attackAndCheck = player2.cpuResponse();
            if (attackAndCheck === true) {
              player2Board.style.display = 'none';
              player1Board.style.display = 'none';
              instructions.style.display = 'none';
              loseDeclaration.style.display = 'flex';
            } else {
              const nodeRow = attackAndCheck[0][0];
              const nodeCol = attackAndCheck[0][1];
              const attackedNode = document.getElementById(`playerNode${nodeRow},${nodeCol}`);
              if (attackAndCheck[1] === 'Miss!') {
                attackedNode.style.backgroundColor = 'gray';
              } else if (attackAndCheck[1] === 'Hit & ship sunk!') {
                attackedNode.style.backgroundColor = 'red';
                sunkNotif2.style.display = 'flex';
                setTimeout(removeSunk2, 2000);
              } else {
                attackedNode.style.backgroundColor = 'red';
              }
            }
          } else {
            player2Board.style.display = 'none';
            player1Board.style.display = 'none';
            instructions.style.display = 'none';
            winDeclaration.style.display = 'flex';
          }
        });
      }
    }
  }

  function buildPlacementBoard() {
    let placeOri = 'horizontal';
    let placeLength = 5;
    let placeNum = 0;
    for (let i = 0; i < 10; i += 1) {
      for (let p = 0; p < 10; p += 1) {
        const gridNode = document.createElement('div');
        gridNode.id = `placementNode${i},${p}`;
        placementBoard.appendChild(gridNode);
        gridNode.style.width = '50px';
        gridNode.style.height = '50px';
        gridNode.style.outlineColor = 'black';
        gridNode.style.outlineStyle = 'solid';
        gridNode.style.outlineWidth = '1px';
        gridNode.style.backgroundColor = 'white';

        gridNode.addEventListener('mouseover', () => {
          if (placeNum === 4) {
            placementBoard.style.pointerEvents = 'none';
            startGame.style.display = 'block';
            return;
          }
          if (placeOri === 'horizontal') {
            for (let q = 0; q < placeLength; q += 1) {
              const shipSelection = document.getElementById(`placementNode${i},${p + q}`);
              if (shipSelection !== null) {
                shipSelection.style.backgroundColor = 'green';
              }
            }
          } else {
            for (let q = 0; q < placeLength; q += 1) {
              const shipSelection = document.getElementById(`placementNode${i + q},${p}`);
              if (shipSelection !== null) {
                shipSelection.style.backgroundColor = 'green';
              }
            }
          }
        });

        gridNode.addEventListener('mouseout', () => {
          if (placeOri === 'horizontal') {
            for (let q = 0; q < placeLength; q += 1) {
              const shipSelection = document.getElementById(`placementNode${i},${p + q}`);
              if (shipSelection !== null) {
                shipSelection.style.backgroundColor = 'white';
              }
            }
          } else {
            for (let q = 0; q < placeLength; q += 1) {
              const shipSelection = document.getElementById(`placementNode${i + q},${p}`);
              if (shipSelection !== null) {
                shipSelection.style.backgroundColor = 'white';
              }
            }
          }
        });

        gridNode.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          const mouseoutTrig = new Event('mouseout');
          gridNode.dispatchEvent(mouseoutTrig);
          if (placeOri === 'horizontal') {
            placeOri = 'vertical';
          } else {
            placeOri = 'horizontal';
          }
          const mouseoverTrig = new Event('mouseover');
          gridNode.dispatchEvent(mouseoverTrig);
        });

        gridNode.addEventListener('click', (event) => {
          if (event.button === 0) {
            const shipPlace = player1.grid.placeShip(placeLength, [i, p], placeOri);
            if (shipPlace === false) {
              return;
            }
            if (placeOri === 'horizontal') {
              for (let q = 0; q < placeLength; q += 1) {
                const shipSelection = document.getElementById(`placementNode${i},${p + q}`);
                shipSelection.style.pointerEvents = 'none';
                shipSelection.id = 'none';
              }
            } else {
              for (let q = 0; q < placeLength; q += 1) {
                const shipSelection = document.getElementById(`placementNode${i + q},${p}`);
                shipSelection.style.pointerEvents = 'none';
                shipSelection.id = 'none';
              }
            }
            placeLength -= 1;
            placeNum += 1;
            if (placeNum === 4) {
              placementBoard.style.pointerEvents = 'none';
              startGame.style.display = 'block';
            }
          }
        });
      }
    }
    startGame.addEventListener('click', () => {
      player2.cpuBuildShips();
      placeShipGrid.style.display = 'none';
      buildPlayerBoards();
    });
  }
  buildPlacementBoard();
}

exports.function = buildGame;
