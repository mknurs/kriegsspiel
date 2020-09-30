const {
  ROWS,
  COLS,
  A_COLOR,
  B_COLOR
} = require("../constants");

const {
  distance,
  deselect
} = require("./utils");
const {
  Arsenal,
  Relay,
  SwiftRelay,
  Infantry,
  Cavalry,
  Cannon,
  SwiftCannon
} = require("./units");

function canPlace(state, player, cell) {
  let feature = state.board[cell.i][cell.j].feature;
  if (
    player.placedUnits < state.units.length &&
    feature.traversable &&
    (player.turn ?
      cell.i >= ROWS / 2 :
      cell.i < ROWS / 2)
  ) {
    return true;
  } else {
    return false;
  }
}

function place(state, player, cell) {
  let Unit = state.units[player.placedUnits];
  if (
    Unit == Arsenal &&
    !state.board[cell.i][cell.j].arsenal
  ) {
    state.board[cell.i][cell.j].arsenal = new Unit(player);
    player.placedUnits++;
  } else if (
    Unit != Arsenal &&
    !state.board[cell.i][cell.j].unit
  ) {
    state.board[cell.i][cell.j].unit = new Unit(player);
    player.placedUnits++;
  }
}

function canSelect(state, player, cell) {
  if (
    player.turn === state.turn &&
    state.board[cell.i][cell.j].unit &&
    state.board[cell.i][cell.j].unit.player.id === player.id
  ) {
    return true;
  } else {
    return false;
  }
}

function select(state, cell) {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (state.board[i][j].unit) {
        state.board[i][j].unit.selected = false;
      } else {
        continue;
      }
    }
  }
  state.board[cell.i][cell.j].unit.selected = true;
  state.selected = {
    i: cell.i,
    j: cell.j
  }
}

function canMove(state, player, cell) {
  if (
    player.turn === state.turn &&
    state.selected &&
    !state.board[cell.i][cell.j].unit &&
    state.board[cell.i][cell.j].feature.traversable &&
    state.board[state.selected.i][state.selected.j].unit.moves.curr >= distance(state.selected, cell)
  ) {
    return true;
  } else {
    return false;
  }
}

function move(state, cell) {
  state.board[cell.i][cell.j].unit = state.board[state.selected.i][state.selected.j].unit;
  state.board[cell.i][cell.j].unit.moves.curr -= distance(state.selected, cell);
  state.board[cell.i][cell.j].unit.selected = false;

  state.board[state.selected.i][state.selected.j].unit = null;
  state.selected = null;

  // add move moves to player
}

function canAttack(state, player, cell) {
  if (
    player.turn === state.turn &&
    state.selected &&
    state.board[cell.i][cell.j].unit &&
    state.board[cell.i][cell.j].unit.player.id != player.id &&
    state.board[state.selected.i][state.selected.j].unit.moves.curr >= distance(state.selected, cell) &&
    state.board[cell.i][cell.j].unit.aggregateDefense < state.board[cell.i][cell.j].unit.aggregateAttack
    // check attack and defense
  ) {
    return true;
  } else {
    return false;
  }
}

function attack(state, cell) {
  state.board[cell.i][cell.j].unit = state.board[state.selected.i][state.selected.j].unit;
  state.board[cell.i][cell.j].unit.moves.curr -= distance(state.selected, cell);
  state.board[cell.i][cell.j].unit.selected = false;

  state.board[state.selected.i][state.selected.j].unit = null;
  state.selected = null;

  // add attack moves to player
}

module.exports = {
  canPlace,
  canSelect,
  select,
  canMove,
  canAttack,
  place,
  move,
  attack
}