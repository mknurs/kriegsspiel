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

function canPlace(state, player) {
  let feature = state.board[state.selected.i][state.selected.j].feature;
  let unit = state.board[state.selected.i][state.selected.j].unit;
  let cell = { i: state.selected.i, j: state.selected.j };
  let rows = state.board.length;

  if (
    player.units < state.units.length &&
    feature.traversable &&
    !unit &&
    (player.turn ?
      cell.i >= rows/ 2 :
      cell.i < rows / 2)
  ) {
    console.log("Can place.")
    return true;
  } else {
    console.log(
      "Can't place on " + cell.i + " " + cell.j +
      (player.units < state.units.length) + " " +
      (feature.traversable == true) + " " +
      (unit == null) + " " +
      (player.turn ? cell.i >= state.rows / 2 : cell.i < state.rows / 2)
    )
    return false;
  }
}

function place(state, player) {
  let Unit = state.units[player.units].unit;
  let cell = { i: state.selected.i, j: state.selected.j };
  let rows = state.board.length;

  if (
    player.units < state.units.length &&
    state.board[state.selected.i][state.selected.j].feature.traversable &&
    !state.board[state.selected.i][state.selected.j].unit &&
    (player.turn ?
      cell.i >= rows/ 2 :
      cell.i < rows / 2)
  ) {
    state.board[cell.i][cell.j].unit = new Unit(player);
    player.units++;
  }
  state.selected = null;
}

/*function canMove(state, player) {
  let board = state.board;

  if (
    player.turn === state.turn &&
    player.moves < state.moves &&
    state.selected &&
    state.targeted &&
    board[state]
    !board[state.targeted.i][state.targeted.j].unit &&
    board[state.targeted.i][state.targeted.j].feature.traversable &&
    board[state.selected.i][state.selected.j].unit.moves.curr >= distance(state.selected, state.targeted)
  ) {
    let sel = state.selected;
    let tar = state.targeted;
    if (distance(sel, tar) == 2) {
      let di = (tar.i - sel.i) / 2;
      let dj = (tar.j - sel.i) / 2;
      let cmov = { i: Math.ceil(sel.i + di), j: Math.ceil(sel.j + dj) };
      let fmov = { i: Math.floor(sel.i + di), j: Math.floor(sel.j + dj) };
      if (
        (!board[cmov.i][cmov.j].unit &&
        board[cmov.i][cmov.j].feature.traversable) ||
        (!board[fmov.i][fmov.j].unit &&
        board[fmov.i][fmov.j].feature.traversable)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}*/

function move(state, player) {
  let sel = state.selected;
  let tar = state.targeted;
  if (
    state.board[sel.i][sel.j].unit.moves.curr ==
    state.board[sel.i][sel.j].unit.moves.init
  ) {
    player.moves++;
  }

  state.board[tar.i][tar.j].unit = state.board[sel.i][sel.j].unit;
  state.board[tar.i][tar.j].unit.moves.curr -= distance(sel, tar);
  state.board[tar.i][tar.j].unit.selected = false;

  state.board[sel.i][sel.j].unit = null;
  state.selected = null;
  state.targeted = null;
}

function canAttack(state, player, cell) {
  if (
    player.turn === state.turn &&
    player.attacks < state.attacks &&
    state.selected &&
    state.board[cell.i][cell.j].unit &&
    state.board[cell.i][cell.j].unit.player.id != player.id &&
    state.board[state.selected.i][state.selected.j].unit.moves.curr >= distance(state.selected, cell) &&
    state.board[cell.i][cell.j].unit.aggregateDefense < state.board[cell.i][cell.j].unit.aggregateAttack
  ) {
    return true;
  } else {
    return false;
  }
}

function attack(state, player, cell) {
  if (
    state.board[cell.i][cell.j].unit.aggregateDefense -
    state.board[cell.i][cell.j].unit.aggregateAttack <=
    -2
  ) {
    state.board[cell.i][cell.j].unit = state.board[state.selected.i][state.selected.j].unit;
    state.board[cell.i][cell.j].unit.moves.curr -= distance(state.selected, cell);
    state.board[cell.i][cell.j].unit.selected = false;

    state.board[state.selected.i][state.selected.j].unit = null;
  } else {
    state.board[cell.i][cell.j].unit.retreat = true;
  }
  
  state.selected = null;
  player.attacks++
  // add attack moves to player
}

function action(state, player) {
  let sel = state.selected;
  let tar = state.targeted;

  sel.u = state.board[sel.i][sel.j].unit;
  sel.f = state.board[sel.i][sel.j].feature;
  sel.a = state.board[sel.i][sel.j].arsenal;

  tar.u = state.board[tar.i][tar.j].unit;
  tar.f = state.board[tar.i][tar.j].feature;
  tar.a = state.board[tar.i][tar.j].arsenal;


  if (
    sel.u &&
    sel.u.player.id == player.id
  ) {
    // either move or attack
    if ( // move
      !tar.u &&
      player.moves < state.moves &&
      sel.f.traversable &&
      sel.u.moves.curr >= distance(sel, tar)
    ) {
      if (distance(sel, tar) == 2) {
        let board = state.board;
        let di = (tar.i - sel.i) / 2;
        let dj = (tar.j - sel.j) / 2;
        let cmov = { i: Math.ceil(sel.i + di), j: Math.ceil(sel.j + dj) };
        let fmov = { i: Math.floor(sel.i + di), j: Math.floor(sel.j + dj) };
        if (
          (!board[cmov.i][cmov.j].unit &&
          board[cmov.i][cmov.j].feature.traversable) ||
          (!board[fmov.i][fmov.j].unit &&
          board[fmov.i][fmov.j].feature.traversable)
        ) {
          sel.u.moves.curr == sel.u.moves.init ?
            player.moves++ :
            player.moves += 0;
          sel.u.moves.curr -= distance(sel, tar);
          state.board[state.targeted.i][state.targeted.j].unit = sel.u;
          state.board[state.selected.i][state.selected.j].unit = null;
          state.selected = null;
          state.targeted = null;
        } else {
          state.selected = null;
          state.targeted = null;
        }
      } else {
        sel.u.moves.curr == sel.u.moves.init ?
          player.moves++ :
          player.moves += 0;
        sel.u.moves.curr -= distance(sel, tar);
        state.board[state.targeted.i][state.targeted.j].unit = sel.u;
        state.board[state.selected.i][state.selected.j].unit = null;
        state.selected = null;
        state.targeted = null;
      }
    } else if ( // attack
      tar.u &&
      tar.u.player.id != player.id &&
      player.attacks < state.attacks &&
      inRange(sel, tar, sel.u.range) &&
      tar.u.aggregateDefense - tar.u.aggregateAttack < 0 
    ) {
      player.attacks++;
      state.board[state.targeted.i][state.targeted.j].unit = null;
      state.selected = null;
      state.targeted = null;
    }
  }
}

module.exports = {
  canPlace,
  canAttack,
  place,
  move,
  attack,
  action
}