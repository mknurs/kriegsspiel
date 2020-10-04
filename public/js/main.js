
// get player name and battlefield name from url
const { username, roomname } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const client = io();
let roomState;
let player;
let enemy;

// emit "join" on connection
client.emit("join", { username, roomname });

// handle incoming state
client.on("state", handleState);

// handle state
function handleState(state) {
  state = JSON.parse(state);
  state.playerA.id == client.id ?
    (player = state.playerA, enemy = state.playerB) :
    (player = state.playerB, enemy = state.playerA);
  roomState = state;
  console.log(`Turn: ${state.turn}. Player: ${player}. Enemy: ${enemy}.`)
  paintGame(state);
  writeGame(state);
}

/*
Canvas and button
*/
const canvas = document.querySelector("canvas");

canvas.addEventListener('click', function(e) {
  emitCellClick(canvas, e)
})

const nextBtn = document.getElementById("nextBtn");

nextBtn.addEventListener('click', function() {
  emitBtnClick({ username, roomname })
});

/*
Paint game
*/
function paintGame(state) {
  const ctx = canvas.getContext("2d");
  const rows = state.board.length;
  const cols = state.board[0].length;
  const cell = {
    width: canvas.width / cols,
    height: canvas.height / rows,
  };

  /*
  Drawing functions
  */
  function drawGrid(rows, cols) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#333";
    ctx.strokeWidth = 1;

    ctx.beginPath();
    for (let i = 0; i < rows + 1; i++) {
      ctx.moveTo(0, cell.height * i);
      ctx.lineTo(canvas.width, cell.height * i);
    };
    for (let j = 0; j < cols + 1; j++) {
      ctx.moveTo(cell.width * j, 0);
      ctx.lineTo(cell.width * j, canvas.height);
    };
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (canvas.height / 2) - 1)
    ctx.lineTo(canvas.width, (canvas.height / 2) - 1)
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (canvas.height / 2) + 1)
    ctx.lineTo(canvas.width, (canvas.height / 2) + 1)
    ctx.stroke();
  }

  function drawMountain(i, j) {
    ctx.restore();
    ctx.fillStyle = "#333";
    ctx.globalAlpha = 1;

    ctx.beginPath();
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
  }

  function drawMountainpass(i, j) {
    ctx.restore();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    ctx.globalAlpha = 1;

    ctx.beginPath();
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

  function drawFort(i, j) {
    ctx.restore();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    ctx.globalAlpha = 1;

    ctx.beginPath();
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

  function drawArsenal(i, j, color) {
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.globalAlpha = 1;

    ctx.beginPath();
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

  function drawRelay(i, j, color) {
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.globalAlpha = 1;

    // unit rect
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

  function drawSwiftRelay(i, j, color) {
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.fillStyle = color;
    ctx.globalAlpha = 1;

    // unit rect
    ctx.strokeRect(
      (j * cell.width) + (1/12 * cell.width),
      (i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );

    // swift circs
    ctx.beginPath();
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

  function drawInfantry(i, j, color) {
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.globalAlpha = 1;

    // unit rect
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

  function drawCavalry(i, j, color) {
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.globalAlpha = 1;

    // unit rect
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
    ctx.setLineDash([]);
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

  function drawCannon(i, j, color) {
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.fillStyle = color;
    ctx.globalAlpha = 1;

    // unit rect
    ctx.strokeRect(
      (j * cell.width) + (1/12 * cell.width),
      (i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );

    // unit path
    ctx.beginPath();
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

  function drawSwiftCannon(i, j, color) {
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.fillStyle = color;
    ctx.globalAlpha = 1;

    // unit rect
    ctx.strokeRect(
      (j * cell.width) + (1/12 * cell.width),
      (i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );

    // swift circs
    ctx.beginPath();
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

  function drawOnline(i, j, player) {
    ctx.restore();
    ctx.fillStyle = player.color;
    ctx.globalAlpha = 0.2;

    ctx.beginPath();
    ctx.arc(
      (j * cell.width) + (3/6 * cell.width),
      (i * cell.height) + (3/6 * cell.height),
      cell.width * 1/24,
      0,
      Math.PI * 2,
      true
    );
    ctx.fill();
  }

  let board = state.board;
  if (
    !player.turn
  ) {
    board.reverse().forEach(arr => arr.reverse());
    if (player.selected) {
      let rows = state.board.length;
      let cols = state.board[0].length;
      player.selected.i = rows - player.selected.i - 1;
      player.selected.j = cols - player.selected.j - 1;
    }
  }

  // clear and restore
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw grid
  drawGrid(rows, cols);

  // iterate through board
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // draw online
      if (
        board[i][j].online.length > 0
      ) {
        if (board[i][j].online.includes(player.turn)) {
          drawOnline(i, j, player);
        }
        if (
          state.battle &&
          board[i][j].online.includes(enemy.id)
        ) {
          drawOnline(i, j, enemy);
        }
      }
      // draw features
      let feature = board[i][j].feature;
      switch(feature.name) {
        case "mountain":
          drawMountain(i, j);
          break;
        case "mountainPass":
          drawMountainpass(i, j);
          break;
        case "fortification":
          drawFort(i, j);
          break;
        default:
          break;
      }

      // draw arsenals
      if (board[i][j].arsenal) {
        let arsenal = board[i][j].arsenal;
        let color = arsenal.player.color;
        if (
          !state.battle &&
          arsenal.player.turn != player.turn
        ) {
          continue;
        } else {
          drawArsenal(i, j, color);
        }
      }

      // draw units
      if (board[i][j].unit) {
        let unit = board[i][j].unit;
        let color;
        player.selected && player.selected.i == i && player.selected.j == j ?
          color = "red" :
          color = unit.player.color;
        if (
          !state.battle &&
          unit.player.turn != player.turn
        ) {
          continue;
        } else {
          switch (unit.name) {
            case "relay":
              drawRelay(i, j, color);
              break;
            case "swiftRelay":
              drawSwiftRelay(i, j, color);
              break;
            case "infantry":
              drawInfantry(i, j, color);
              break;
            case "cavalry":
              drawCavalry(i, j, color);
              break;
            case "cannon":
              drawCannon(i, j, color);
              break;
            case "swiftCannon":
              drawSwiftCannon(i, j, color);
              break;
            default:
              break;
          }
        }
      }

      // draw stats
      if (
        state.battle &&
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

      // draw selected
    }
  }
}

function writeGame(state) {
  // banner
  const bannerInfo = document.getElementById("bannerInfo");
  bannerInfo.innerHTML = `Battle of ${roomname}.`

  // placement or battle
  const modeInfo = document.getElementById("modeInfo");
  const nextBtn = document.getElementById("nextBtn");
  state.battle ?
  (modeInfo.innerHTML = "Battle.", nextBtn.innerHTML = "Next turn.") :
  (modeInfo.innerHTML = "Placement.", nextBtn.innerHTML = "Ready.");

  // turn info
  const turnInfo = document.getElementById("turnInfo");
  if (state.battle) {
    player.turn == state.turn ?
      turnInfo.innerHTML = player.name :
      turnInfo.innerHTML = enemy.name;
  } else {
    turnInfo.innerHTML = "Both.";
  }

  // user info
  const userInfo = document.getElementById("userInfo");
  userInfo.innerHTML = player.name;

  // extra user info
  const extraUserInfo = document.getElementById("extraUserInfo");

  (!state.battle && state.units[player.units]) ?
    extraUserInfo.innerHTML = `Place your ${state.units[player.units].name}.` :
    extraUserInfo.innerHTML = `Moves: ${state.moves - player.moves}/${state.moves}. Attacks: ${state.attacks - player.attacks}/${state.attacks}.`

  // selected info
  const selectedInfo = document.getElementById("selectedInfo");
  if (player.selected) {
    /*if (!player.turn) {
      let rows = state.board.length;
      let cols = state.board[0].length;
      player.selected.i = rows - player.selected.i - 1;
      player.selected.j = cols - player.selected.j - 1;
    }*/
    let i = player.selected.i;
    let j = player.selected.j;
    if (state.board[i][j].unit) {
      let unit = state.board[i][j].unit;
      selectedInfo.innerHTML = `Selected: ${unit.name} (${unit.player.name}), moves: ${unit.moves.curr}/${unit.moves.init}, attack: ${unit.attack}, defense: ${unit.defense}, range: ${unit.range}.`
    }
  }

  // disable button
  if (
    (state.battle && player.turn == state.turn) ||
    (!state.battle && player.units == state.units.length)
  ) {
    nextBtn.disabled = false
  } else {
    nextBtn.disabled = true
  }
}

function emitCellClick(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const rows = roomState.board.length;
  const cols = roomState.board[0].length;

  // convert to i and j
  let i = Math.floor(y / (rect.height / rows));
  let j = Math.floor(x / (rect.width / cols));

  // flips for player B
  if (!player.turn) {
    i = rows - i - 1;
    j = cols - j - 1;
  }

  // emits click
  client.emit("click", { username, roomname, i, j })
}

function emitBtnClick({ username, roomname }) {
  client.emit("btnClick", { username, roomname });
}

/*
Drawing functions
*/
