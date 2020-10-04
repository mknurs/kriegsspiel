const {
  ROWS,
  COLS,
  A_COLOR,
  B_COLOR
} = require("../constants");

function distance(start, end) {
  let i = Math.abs(start.i - end.i);
  let j = Math.abs(start.j - end.j);
  // if diagonal moves are NOT allowed
  // return i + j;
  // if diagonal moves are allowed
  return Math.max(i, j)
};

function inRange(start, end, range) {
  let direction = [
    (end.i - start.i) / (Math.abs(end.i - start.i)),
    (end.j - start.j) / (Math.abs(end.j - start.j))
  ];

  for (let i = 1; i <= range; i++) {
    if (
      (start.i + (direction[0] * i) == end.i) &&
      (start.j + (direction[1] * i) == end.j)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function resetStats(state) {
  let board = state.board;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (board[i][j].unit) {
        let unit = board[i][j].unit;
        unit.moves.curr = unit.moves.init;
      }
    }
  }
}

function resetOnline(state) {
  let board = state.board;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      board[i][j].online = [];
    }
  }
}

function resetAggregate(state) {
  let board = state.board;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (board[i][j].unit) {
        let unit = board[i][j].unit;
        unit.aggregateDefense = 0;
        unit.aggregateAttack = 0;
      }
    }
  }
}

function aggregateStats(state) {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let cell = state.board[i][j];
      if (cell.unit) {
        cell.unit.aggregateDefense = cell.unit.defense + (cell.feature.defense || 0);
        cell.unit.aggregateAttack = 0;
        let squaresToCheck = [
          [i-3,j-3],                    [i-3,j  ],                    [i-3,j+3],
                    [i-2,j-2],          [i-2,j  ],          [i-2,j+2],
                              [i-1,j-1],[i-1,j  ],[i-1,j+1],
          [i  ,j-3],[i  ,j-2],[i  ,j-1],[i  ,j  ],[i  ,j+1],[i  ,j+2],[i  ,j+3],
                              [i+1,j-1],[i+1,j  ],[i+1,j+1],
                    [i+2,j-2],          [i+2,j  ],          [i+2,j+2],
          [i+3,j-3],                    [i+3,j  ],                    [i+3,j+3]
        ];
        squaresToCheck.forEach(
          function(val) {
            if (
              state.board[val[0]] != undefined &&
              state.board[val[0]][val[1]] != undefined
            ) {
              let square = state.board[val[0]][val[1]];
              if (
                square.unit &&
                square.unit.player.turn == cell.unit.player.turn &&
                square.unit.range >= distance(cell, square)
              ) {
                cell.unit.aggregateDefense += square.unit.defense;
              };
              if (
                square.unit &&
                square.unit.player.turn != cell.unit.player.turn &&
                square.unit.range >= distance(cell, square)
              ) {
                cell.unit.aggregateAttack += square.unit.attack;
              };
            };
          }
        );
      };
    };
  };
}

/*
Communication lines
*/

function radiateLines(turn, state) {
  // get positions of arsenals and relays
  let comPos = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (
        (state.board[i][j].arsenal &&
        state.board[i][j].arsenal.player.turn == turn) ||
        (state.board[i][j].online.includes(turn) &&
        state.board[i][j].unit &&
        state.board[i][j].unit.name == ("relay" || "swiftRelay") &&
        state.board[i][j].unit.player.turn == turn)
      ) {
        comPos.push([i, j]);
      };
    };
  };

  // radiate from arsenals and online relays
  for (let k = 0; k < comPos.length; k++) {
    let directions = [
      [-1, -1], [-1,  0], [-1, +1],
      [ 0, -1],           [ 0, +1],
      [+1, -1], [+1,  0], [+1, +1]
    ];
    let i = comPos[k][0];
    let j = comPos[k][1];
    directions.forEach(
      function(direction) {
        i = comPos[k][0];
        j = comPos[k][1];
        while (
          state.board[i][j] != undefined &&
          state.board[i][j].feature.traversable
        ) {
          if (!state.board[i][j].online.includes(turn)) {
            state.board[i][j].online.push(turn);
          };
          i += direction[0];
          j += direction[1];
          if (
            state.board[i] != undefined &&
            state.board[i][j] != undefined
          ) {
            state.board[i][j] = state.board[i][j];
          } else {
            break;
          }
        };
      }
    );
  };

  // radiate to adjecent from online units
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let adjecentCells = [
        [i-1,j-1],[i-1,  j],[i-1,j+1],
        [i  ,j-1],          [i  ,j+1],
        [i+1,j-1],[i+1,  j],[i+1,j+1],
      ];
      if (
        state.board[i][j].online.includes(turn) &&
        state.board[i][j].unit &&
        state.board[i][j].unit.player.turn == turn
      ) {
        adjecentCells.forEach(
          (val) => {
            k = val[0];
            l = val[1];
            if (
              state.board[k] != undefined &&
              state.board[k][l] != undefined &&
              state.board[k][l].feature.traversable &&
              !state.board[k][l].online.includes(turn)
            ) {
              state.board[k][l].online.push(turn);
            };
          }
        );
      };
    };
  };
};


function deselect(state) {
  state.selected = null;
  state.targeted = null;
}

module.exports = {
  distance,
  inRange,
  resetOnline,
  resetAggregate,
  resetStats,
  radiateLines,
  aggregateStats,
  deselect,
}