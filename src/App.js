import React, { useState } from 'react';
import './App.css';

let lastMouseX = 0, lastMouseY = 0;
let rotX = -30, rotY = -30;
const space = 100;
const margin = 180;

const containerMouseDown = (event) => {
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  document.querySelector('.container').addEventListener('mousemove', mouseMoved);
}

const containerTouchDown = (event) => {
  lastMouseX = event.touches[0].clientX;
  lastMouseY = event.touches[0].clientY;
  document.querySelector('.container').addEventListener('touchmove', touchMoved);
}

const containerMouseUp = () => {
  document.querySelector('.container').removeEventListener('mousemove', mouseMoved);
}

const containerTouchUp = () => {
  document.querySelector('.container').removeEventListener('touchmove', touchMoved);
}

document.addEventListener('mouseup', containerMouseUp);
document.addEventListener('touchend', containerTouchUp);

const movement = (deltaX, deltaY) => {
  rotY += deltaX * 0.3;
  rotX -= deltaY * 0.3;
  applyRotation();
}

const applyRotation = () => {
  let cubes = document.querySelectorAll('.cube');

  cubes.forEach(function(element) {
    let transform = window.getComputedStyle(element).transform;
    let matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');
    
    let x = matrix[12] || matrix[4];
    let y = matrix[13] || matrix[5];
    let z = matrix[14] || matrix[6];
    element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  })
}

const mouseMoved = (event) => {
  var deltaX = event.pageX - lastMouseX;
  var deltaY = event.pageY - lastMouseY;

  lastMouseX = event.pageX;
  lastMouseY = event.pageY;

  movement(deltaX, deltaY);
}

const touchMoved = (event) => {
  var deltaX = event.changedTouches[0].clientX - lastMouseX;
  var deltaY = event.changedTouches[0].clientY - lastMouseY;

  lastMouseX = event.changedTouches[0].clientX;
  lastMouseY = event.changedTouches[0].clientY;

  movement(deltaX, deltaY);
}

const resizeGame = () => {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let game = document.querySelector('.container');

  let scaleWidth = (windowWidth)/600;
  let scaleHeight = (windowHeight)/600;

  let scale = scaleWidth > scaleHeight ? scaleHeight : scaleWidth;

  game.style.transform = `scale(${scale})`;
}

window.onresize = resizeGame;
window.onload = resizeGame;

function App()
{
  const emptyBoard = [...Array(3)].map(e => [...Array(3)].map(e => Array(3).fill(0)));
  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState(2);
  const [prePlayers, setPrePlayers] = useState(2);

  const handleCellClick = (x,y,z) =>
  {
    if(winner) return null;
    if(board[z][y][x] !== 0) return null;

    board[z][y][x] = currentPlayer;

    setCurrentPlayer(currentPlayer == players ? 1 : currentPlayer+1);

    checkWinner();
  }

  const checkWinner = () => {

    checkDraw();

    let planes = [];

    planes.push([
      board[0][0][0], board[0][0][1], board[0][0][2],
      board[0][1][0], board[0][1][1], board[0][1][2],
      board[0][2][0], board[0][2][1], board[0][2][2]
    ]);

    planes.push([
      board[1][0][0], board[1][0][1], board[1][0][2],
      board[1][1][0], board[1][1][1], board[1][1][2],
      board[1][2][0], board[1][2][1], board[1][2][2]
    ]);

    planes.push([
      board[2][0][0], board[2][0][1], board[2][0][2],
      board[2][1][0], board[2][1][1], board[2][1][2],
      board[2][2][0], board[2][2][1], board[2][2][2]
    ]);

    planes.push([
      board[0][0][0], board[1][0][0], board[2][0][0],
      board[0][1][0], board[1][1][0], board[2][1][0],
      board[0][2][0], board[1][2][0], board[2][2][0]
    ]);

    planes.push([
      board[0][0][1], board[1][0][1], board[2][0][1],
      board[0][1][1], board[1][1][1], board[2][1][1],
      board[0][2][1], board[1][2][1], board[2][2][1]
    ]);

    planes.push([
      board[0][0][2], board[1][0][2], board[2][0][2],
      board[0][1][2], board[1][1][2], board[2][1][2],
      board[0][2][2], board[1][2][2], board[2][2][2]
    ]);

    planes.push([
      board[0][0][0], board[1][0][0], board[2][0][0],
      board[0][0][1], board[1][0][1], board[2][0][1],
      board[0][0][2], board[1][0][2], board[2][0][2]
    ]);

    planes.push([
      board[0][1][0], board[1][1][0], board[2][1][0],
      board[0][1][1], board[1][1][1], board[2][1][1],
      board[0][1][2], board[1][1][2], board[2][1][2]
    ]);

    planes.push([
      board[0][2][0], board[1][2][0], board[2][2][0],
      board[0][2][1], board[1][2][1], board[2][2][1],
      board[0][2][2], board[1][2][2], board[2][2][2]
    ]);

    planes.push([
      board[0][0][0], board[1][0][0], board[2][0][0],
      board[0][1][1], board[1][1][1], board[2][1][1],
      board[0][2][2], board[1][2][2], board[2][2][2]
    ]);

    planes.push([
      board[0][2][0], board[1][2][0], board[2][2][0],
      board[0][1][1], board[1][1][1], board[2][1][1],
      board[0][0][2], board[1][0][2], board[2][0][2]
    ]);

    planes.push([
      board[0][0][0], board[0][0][1], board[0][0][2],
      board[1][1][0], board[1][1][1], board[1][1][2],
      board[2][2][0], board[2][2][1], board[2][2][2]
    ]);

    planes.push([
      board[2][0][0], board[2][0][1], board[2][0][2],
      board[1][1][0], board[1][1][1], board[1][1][2],
      board[0][2][0], board[0][2][1], board[0][2][2]
    ]);

    planes.push([
      board[0][0][0], board[0][1][0], board[0][2][0],
      board[1][0][1], board[1][1][1], board[1][2][1],
      board[2][0][2], board[2][1][2], board[2][2][2]
    ]);

    planes.push([
      board[0][0][2], board[0][1][2], board[0][2][2],
      board[1][0][1], board[1][1][1], board[1][2][1],
      board[2][0][0], board[2][1][0], board[2][2][0]
    ]);

    planes.forEach(plane => {
      const possibleWaysToWin = [
        [plane[0], plane[1], plane[2]],
        [plane[3], plane[4], plane[5]],
        [plane[6], plane[7], plane[8]],
        [plane[0], plane[3], plane[6]],
        [plane[1], plane[4], plane[7]],
        [plane[2], plane[5], plane[8]],
        [plane[0], plane[4], plane[8]],
        [plane[2], plane[4], plane[6]]
      ];

      possibleWaysToWin.forEach(cells => {
        for(let p = 1; p <= players; p++) {
          if(cells.every(cell => cell === p)) {
            setWinner(p);
          }
        }
      });
    });
  }

  const checkDraw = () => {
    if(board.every(itemZ =>
        itemZ.every(itemY =>
          itemY.every(itemX =>
            itemX !== 0
          )
        )
      )
    ) {
      setWinner("Draw");
    }
  }

  const resetGame = () => {
    setPlayers(prePlayers);
    setCurrentPlayer(1);
    setBoard(emptyBoard);
    setWinner(null);
    rotX = -30;
    rotY = -30;
    applyRotation();
    document.querySelector('.container').style.backgroundColor = "#ff0";
    setTimeout(() => {
      document.querySelector('.container').style.backgroundColor = "#222";
    }, 100);
  }

  const handlePlayers = (event) => {
    setPrePlayers(event.target.value);
  }

  return (
    <div>
      <div className="container" onMouseDown={containerMouseDown} onTouchStart={containerTouchDown}>
        <div className="world">
          {board.map((itemZ, z) => (
            itemZ.map((itemY, y) => (
              itemY.map((itemX, x) => (
                <div
                  key={`${x}${y}${z}`}
                  className={`cube c${x}${y}${z} p${itemX}`}
                  onClick={() => handleCellClick(x,y,z)}
                  style={{
                    transform: `
                      translateX(${margin+x*space}px)
                      translateY(${margin+y*space}px)
                      translateZ(${-space-margin+z*space}px)
                      rotateX(${rotX}deg)
                      rotateY(${rotY}deg)`,
                    transformOrigin: `
                      ${((1-x)*space)+space/8}px
                      ${((1-y)*space)+space/8}px
                      ${((1-z)*space)+space/8}px`
                  }}

                >
                  <div className="face front"></div>
                  <div className="face back"></div>
                  <div className="face right"></div>
                  <div className="face left"></div>
                  <div className="face top"></div>
                  <div className="face bottom"></div>
                </div>
              ))
            ))
          ))}
        </div>
      </div>
      <div className="menu">
        {winner &&
          <div className="winner">
            {winner !== "Draw" ?
              <p>Player<br/><span className={`next p${winner}`}>{winner}</span><br/>Won!</p>
            :
              <p>Draw!<br/>Nobody<br/>Won!</p>
            }
          </div>
        }
        {!winner &&
          <p>Next Player: <span className={`next p${currentPlayer}`}>{currentPlayer}</span></p>
        }
        <select value={prePlayers} onChange={handlePlayers}>
          <option value="2">2 players</option>
          <option value="3">3 players</option>
          <option value="4">4 players</option>
          <option value="5">5 players</option>
          <option value="6">6 players</option>
        </select>
        <div className={`start-to-effect ${players === prePlayers ? 'invisible' : ''}`}>Start a new game to take effect!</div>
        <button onClick={resetGame}>Start New Game</button>
      </div>
    </div>
  );
}

export default App;
