const playersModule = require('./players');

const Player = playersModule.class;

function buildGame() {
  const player1 = new Player();
  const player2 = new Player(player1);
  player1.newGrid();
  player2.newGrid();

  player1.placeShip(5, [0, 0], 'horizontal');
  player1.placeShip(4, [3, 2], 'horizontal');
  player1.placeShip(4, [4, 0], 'vertical');
  player1.placeShip(3, [7, 7], 'horizontal');
  player1.placeShip(3, [7, 2], 'vertical');

  player2.placeShip(5, [6, 0], 'horizontal');
  player2.placeShip(4, [0, 9], 'vertical');
  player2.placeShip(4, [2, 0], 'vertical');
  player2.placeShip(3, [6, 7], 'horizontal');
  player2.placeShip(3, [9, 6], 'horizontal');

  const player1Board = document.getElementById('yourBoard');
  const player2Board = document.getElementById('enemyBoard');

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
      if (player1.grid.squares[i][p].length > 2) {
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
        } else {
          gridNode.style.backgroundColor = 'red';
        }
        const checkWin = player2.grid.checkFleet();
        if (checkWin === false) {
          const attackAndCheck = player2.cpuResponse();
          if (attackAndCheck === true) {
            player2Board.style.pointerEvents = 'none';
            alert('You lose...');
          } else {
            console.log(attackAndCheck);
            const nodeRow = attackAndCheck[0][0];
            const nodeCol = attackAndCheck[0][1];
            const attackedNode = document.getElementById(`playerNode${nodeRow},${nodeCol}`);
            if (attackAndCheck[1] === 'Miss!') {
              attackedNode.style.backgroundColor = 'gray';
            } else {
              attackedNode.style.backgroundColor = 'red';
            }
          }
        } else {
          player2Board.style.pointerEvents = 'none';
          alert('You win!');
        }
      });
    }
  }
}

exports.function = buildGame;
