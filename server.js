const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const uuidv4 = require("uuid")

const {
  ROWS,
  COLS,
  A_COLOR,
  B_COLOR
} = require("constants");

const {
  distance,
  inRange,
  aggregateStats,
  radiateArsenals,
  radiateLines,
  resetStats,
  resetAggregate,
  resetOnline,
} = require("./utils/utils");

const {
  canPlace,
  canSelect,
  select,
  canMove,
  canAttack,
  place,
  action,
  move,
  attack
} = require("./utils/actions");

const {
  playerA,
  playerB,
  initString,
  makeBoard,
  Relay,
  SwiftRelay,
  Infantry,
  Cavalry,
  Cannon,
  SwiftCannon
} = require("./utils/board");
const actions = require("./utils/actions");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const state = {};

function newGameState(roomname) {
  return {
    name: roomname,
    battle: false,
    turn: true,
    playerA: {...playerA},
    playerB: {...playerB},
    spectators: [],
    board: makeBoard(initString),
    units: [ { unit: Relay, name: "relay" }, { unit: SwiftRelay, name: "swift relay" }, { unit: Infantry, name: "infantry" }, { unit: Cavalry, name: "cavalry" }],
    moves: 5,
    attacks: 1,
    selected: null,
    targeted: null,
  };
}

function emitStateToRoom(state, room) {
  // reset aggregate stats and online squares
  resetAggregate(state);
  resetOnline(state);

  // calculate comms
  radiateLines(state.playerA.turn, state);
  radiateLines(state.playerB.turn, state);

  // calculate aggregate stats
  aggregateStats(state);

  // emit state
  io.to(room).emit("state", JSON.stringify(state));
}

// run when client connects
io.on("connection", client => {
  console.log("a user connected");
  io.emit("uuid", uuidv4())

  client.on("disconnect", () => {
    console.log("user disconnected")
  });

  client.on("join", handleJoin);
  client.on("click", handleClick);
  client.on("btnClick", handleBtnClick);

  // handlers
  function handleJoin({ username, roomname }) {
    client.join(roomname);
    if (!state[roomname]) {
      state[roomname] = {...newGameState(roomname)}
    }

    emitStateToRoom(state[roomname], roomname);

    if (!state[roomname].playerA.id) {
      // let player = state[roomname].playerA;
      state[roomname].playerA.id = client.id;
      state[roomname].playerA.name = username;
    } else if (!state[roomname].playerB.id) {
      // let player = state[roomname].playerB;
      state[roomname].playerB.id = client.id;
      state[roomname].playerB.name = username;
    } else {
      let user = {
        id: client.id,
        name: username,
      }
      state[roomname].spectators.push(user);
    }

    emitStateToRoom(state[roomname], roomname);
  }

  function handleClick({ username, roomname, i, j }) {
    let gameState = state[roomname];
    let player;
    let enemy;
    gameState.playerA.name == username ?
      (player = gameState.playerA, enemy = gameState.playerB) :
      (player = gameState.playerB, enemy = gameState.playerA);

    player.selected = { i, j };

    if (
      gameState.battle &&
      ((gameState.playerA.name == username && gameState.playerA.turn == gameState.turn) ||
      (gameState.playerB.name == username && gameState.playerB.turn == gameState.turn))
    ) {
      !gameState.selected ?
        gameState.selected = { i, j } :
        gameState.targeted = { i, j }

      if (gameState.targeted) {
        action(gameState, player)
      }
    }

    // placing units
    /*if (
      !gameState.battle &&
      gameState.selected &&
      canPlace(gameState, player)
    ) {
      place(gameState, player);
    }*/
    if (
      !gameState.battle &&
      player.units < gameState.units.length
    ) {
      gameState.selected = { i, j };
      place(gameState, player);
    }

    // deselect if action failed
    if (gameState.selected && gameState.targeted) {
      gameState.selected = null;
      gameState.targeted = null;
    }
    emitStateToRoom(gameState, roomname)
  }

  function handleBtnClick({ username, roomname }) {
    let gameState = state[roomname];
    let player;
    let enemy;
    gameState.playerA.name == username ?
      (player = gameState.playerA, enemy = gameState.playerB) :
      (player = gameState.playerB, enemy = gameState.playerA);

    if (!gameState.battle) {
      player.ready = true;
      if (player.ready && enemy.ready) {
        gameState.battle = true;
        const rand = Math.random() < 0.5;
        gameState.turn = rand;
      }
      emitStateToRoom(gameState, roomname);
    } else {
      gameState.turn = !gameState.turn;
      emitStateToRoom(gameState, roomname);
    }
  }


})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.listen()