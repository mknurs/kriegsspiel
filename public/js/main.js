/*
CONSTANTS
*/
const ROWS = 20;
const COLS = 25;
const A_COLOR = "blue";
const B_COLOR = "purple";
/*
***
*/

// get player name and battlefield name from url
const { username, roomname } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});


const client = io();
let roomState;
let player;
let enemy;

// outgoing
client.emit("join", { username, roomname });

// incoming
client.on("state", handleState);

// handlers
function handleState(state) {
  state = JSON.parse(state);
  roomState = state;
  player = state.players.find(player => player.name === username);
  enemy = state.players.find(player => player.name != username);
  paintGame(state);
  writeGame(state);
}

/*
Canvas
*/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const cell = {
  width: canvas.width / COLS,
  height: canvas.height / ROWS,
};

canvas.addEventListener('click', function(e) {
  getClickedCell(canvas, e)
})

function paintGame(state) {
  let board = state.board;
  if (
    !player.turn
  ) {
    board.reverse().forEach(arr => arr.reverse());
  }

  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw grid
  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.strokeWidth = 1;
  for (let i = 0; i < ROWS + 1; i++) {
    ctx.moveTo(0, cell.height * i);
    ctx.lineTo(canvas.width, cell.height * i);
  };
  for (let j = 0; j < COLS + 1; j++) {
    ctx.moveTo(cell.width * j, 0);
    ctx.lineTo(cell.width * j, canvas.height);
  };
  ctx.stroke();

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      // draw online
      if (
        board[i][j].online.length > 0
      ) {
        if (board[i][j].online.includes(player.id)) {
          ctx.beginPath();
          ctx.strokeStyle = player.color;
          ctx.strokeWidth = 1;
          ctx.setLineDash([1, 2])
          
          ctx.arc(
            (j * cell.width) + (3/6 * cell.width),
            (i * cell.height) + (3/6 * cell.height),
            cell.width * 1/24,
            0,
            Math.PI * 2,
            true
          );
          ctx.stroke();
        }
        if (
          roomState.battle &&
          board[i][j].online.includes(enemy.id)
        ) {
          ctx.strokeStyle = enemy.color;
          ctx.beginPath();
          ctx.arc(
            (j * cell.width) + (3/6 * cell.width),
            (i * cell.height) + (3/6 * cell.height),
            cell.width * 1/12,
            0,
            Math.PI * 2,
            true
          );
        }
      }
      // draw features
      let feature = board[i][j].feature;
      switch(feature.name) {
        case "mountain":
          drawMountain(i, j, cell);
          break;
        case "mountainPass":
          drawMountainpass(i, j, cell);
          break;
        case "fortification":
          drawFort(i, j, cell);
          break;
        default:
          break;
      }

      // draw arsenals
      if (board[i][j].arsenal) {
        let arsenal = board[i][j].arsenal;
        if (
          !roomState.battle &&
          arsenal.player.id != player.id
        ) {
          continue;
        } else {
          drawArsenal(i, j, cell, arsenal.player.color);
        }
      }

      // draw units
      if (board[i][j].unit) {
        let unit = board[i][j].unit;
        let color;
        unit.selected ? color = "red" : color = unit.player.color;
        if (
          !roomState.battle &&
          unit.player.id != player.id
        ) {
          continue;
        } else {
          switch (unit.name) {
            case "relay":
              drawRelay(i, j, cell, color);
              break;
            case "swiftRelay":
              drawSwiftRelay(i, j, cell, color);
              break;
            case "infantry":
              drawInfantry(i, j, cell, color);
              break;
            case "cavalry":
              drawCavalry(i, j, cell, color);
              break;
            case "cannon":
              drawCannon(i, j, cell, color);
              break;
            case "swiftCannon":
              drawSwiftCannon(i, j, cell, color);
              break;
            default:
              break;
          }
        }
      }

      // draw stats
      if (
        roomState.battle &&
        board[i][j].unit
      ) {
        let unit = board[i][j].unit;
        let stat = (unit.aggregateDefense - unit.aggregateAttack).toString();
        let color;
        unit.selected ? color = "red" : color = unit.player.color;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(stat, (cell.width * j) + (cell.width / 2) , (cell.height * i) + cell.height);
      }

      
      // console.log(board.featureMatrix)
    }
  }
}

function writeGame(state) {
  const modeInfo = document.getElementById("modeInfo");
  state.battle ? modeInfo.innerHTML = "Battle." : modeInfo.innerHTML = "Placement.";

  const turnInfo = document.getElementById("turnInfo");
  state.battle ? turnInfo.innerHTML = state.players.find(player => player.turn === state.turn).name : turnInfo.innerHTML = "Both.";

  const userInfo = document.getElementById("userInfo");
  userInfo.innerHTML = state.players.find(player => player.name === username).name;

  const nextBtn = document.getElementById("nextBtn");
  state.battle ? nextBtn.innerHTML = "End turn." : nextBtn.innerHTML = "Ready.";

  player.placedUnits < state.units.length ? nextBtn.disabled = true : nextBtn.disabled = false;

  nextBtn.addEventListener('click', function(e) {
    emitBtnClick(e)
  })
}

function getClickedCell(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // convert to i and j
  let i = Math.floor(y / (rect.height / 20));
  let j = Math.floor(x / (rect.width / 25));

  // flips for player B
  if (!player.turn) {
    i = ROWS - i - 1;
    j = COLS - j - 1;
  }

  // emits click
  client.emit("click", { username, roomname, i, j })
}

function emitBtnClick() {
  client.emit("btnClick", { username, roomname, i, j })
}
/*socket.on("init", handleInit);
socket.on("playerJoin", handlePlayerJoin);
socket.on("spectatorJoin", handleSpectatorJoin);
socket.on("gameState", handleGameState);


function handleInit(player) {

}

socket.on("playerJoin", player => {
  gameState.playerB = player;
  socket.emit("sendGameState", gameState)
})

socket.on("recieveGameState", gameState => {
  gameState = gameState
})
// event listeners
joinBattleBtn.addEventListener("click", joinGame)*/

// join battle btn addEventListener("click", joinRoom)



function drawMountain(i, j, cell) {
  ctx.beginPath();
  ctx.fillStyle = "#333";
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (11/12 * cell.height),
  );
  ctx.lineTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (1/12 * cell.height),
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (11/12 * cell.height),
  );
  ctx.closePath();
  ctx.fill();
};

function drawMountainpass(i, j, cell) {
  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (1/12 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (1/6 * cell.width),
    (i * cell.height) + (1/6 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (5/6 * cell.width),
    (i * cell.height) + (1/6 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (1/12 * cell.height)
  );
  ctx.moveTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (11/12 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (5/6 * cell.width),
    (i * cell.height) + (5/6 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (1/6 * cell.width),
    (i * cell.height) + (5/6 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (11/12 * cell.height)
  );
  ctx.stroke();
}

function drawFort(i, j, cell) {
  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (1/12 * cell.height),
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (1/12 * cell.height),
  );
  ctx.lineTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (11/12 * cell.height),
  );
  ctx.closePath();
  ctx.stroke();
}

function drawArsenal(i, j, cell, color) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.moveTo(
    (j * cell.width) + (0 * cell.width),
    (i * cell.height) + (3/6 * cell.height),
  );
  ctx.lineTo(
    (j * cell.width) + (1 * cell.width),
    (i * cell.height) + (3/6 * cell.height),
  );
  ctx.lineTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (1 * cell.height),
  );
  ctx.closePath();
  ctx.stroke();
}

function drawRelay(i, j, cell, color) {
  // unit rect
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height),
    cell.width * 5/6,
    cell.height * 3/6
  );
  // relay
  ctx.beginPath();
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.stroke();
}

function drawSwiftRelay(i, j, cell, color) {
  // unit rect
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height),
    cell.width * 5/6,
    cell.height * 3/6
  );
  // swift circs
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(
    (j * cell.width) + (2/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.moveTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height)
  );
  ctx.arc(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.moveTo(
    (j * cell.width) + (4/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height)
  )
  ctx.arc(
    (j * cell.width) + (4/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
  // relay
  ctx.beginPath();
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.stroke();
}

function drawInfantry(i, j, cell, color) {
  // unit rect
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height),
    cell.width * 5/6,
    cell.height * 3/6
  );
  // draw infantry
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (9/12 * cell.height)
  );
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (9/12 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height)
  );
  ctx.stroke();
}

function drawCavalry(i, j, cell, color) {
  // unit rect
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height),
    cell.width * 5/6,
    cell.height * 3/6
  );
  // draw cavalry
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (9/12 * cell.height)
  );
  ctx.stroke();
}

function drawCannon(i, j, cell, color) {
  // unit rect
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height),
    cell.width * 5/6,
    cell.height * 3/6
  );
  // unit path
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.arc(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (3/6 * cell.height),
    cell.width * 1/12,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
}

function drawSwiftCannon(i, j, cell, color) {
  // unit rect
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height),
    cell.width * 5/6,
    cell.height * 3/6
  );
  // swift circs
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(
    (j * cell.width) + (2/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.moveTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height)
  );
  ctx.arc(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.moveTo(
    (j * cell.width) + (4/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height)
  )
  ctx.arc(
    (j * cell.width) + (4/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
  // unit path
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.arc(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (3/6 * cell.height),
    cell.width * 1/12,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
}