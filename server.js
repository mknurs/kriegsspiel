const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const {
  ROWS,
  COLS,
  A_COLOR,
  B_COLOR
} = require("constants");

const {
  distance,
  aggregateStats,
  radiateArsenals,
  radiateLines,
} = require("./utils/utils");

const {
  canPlace,
  canSelect,
  select,
  canMove,
  canAttack,
  place,
  move,
  attack
} = require("./utils/actions");

const {
  Arsenal,
  Relay,
  SwiftRelay,
  Infantry,
  Cavalry,
  Cannon,
  SwiftCannon
} = require("./utils/units");

const {
  board
} = require("./utils/board");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const state = {};

function newGameState() {
  return {
    battle: false,
    turn: true,
    players: [],
    spectators: [],
    board: board,
    units: [Arsenal, Arsenal, Relay, Relay, Infantry, Cavalry, Cannon, SwiftCannon],
    selected: null,
    targeted: null,
  };
}

function emitStateToRoom(state, room) {
  // calculate comms
  state.players.forEach(
    (player) => {
      let id = player.id;
      radiateLines(id, state)
    }
  )
  // radiateArsenals(state)
  // calculate aggregate stats
  aggregateStats(state)

  io.sockets.in(room)
    .emit("state", JSON.stringify(state));
}

// run when client connects
io.on("connection", client => {
  console.log("a user connected");

  client.on("disconnect", () => {
    console.log("user disconnected")
  });

  client.on("join", handleJoin);
  client.on("click", handleClick)

  // handlers
  function handleJoin({ username, roomname }) {
    client.join(roomname);

    const user = {
      id: client.id,
      name: username,
      room: roomname
    };
    const room = io.sockets.adapter.rooms[roomname];
    let users = room.sockets;
    let numUsers = Object.keys(users).length

    if (numUsers === 1) {
      user.turn = true;
      user.color = "blue";
      user.placedUnits = 0;
      state[roomname] = newGameState();
      state[roomname].players.push(user);
    } else if (numUsers === 2) {
      user.turn = false;
      user.color = "purple";
      user.placedUnits = 0;
      state[roomname].players.push(user);
    } else if (numUsers > 2) {
      state[roomname].spectators.push(user);
    }

    emitStateToRoom(state[roomname], roomname);
  }

  function handleClick({ username, roomname, i, j }) {
    let gameState = state[roomname];
    let player = gameState.players.find(player => player.name === username);
    let enemy = gameState.players.find(player => player.name != username);
    let cell = { i, j };

    if (
      !gameState.battle &&
      canPlace(gameState, player, cell)
    ) {
      place(gameState, player, cell);
    }

    if (
      gameState.battle &&
      canSelect(gameState, player, cell)
    ) {
      select(gameState, cell);
    }

    if (
      gameState.battle &&
      canMove(gameState, player, cell)
    ) {
      move(gameState, cell)
    }

    if (
      gameState.battle &&
      canAttack(gameState, player, cell)
    ) {
      attack(gameState, cell)
    }

    if (
      !gameState.battle &&
      player.placedUnits === gameState.units.length &&
      enemy &&
      enemy.placedUnits === gameState.units.length
    ) {
      gameState.battle = !gameState.battle;
    }

    emitStateToRoom(gameState, roomname)
  }



})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`))