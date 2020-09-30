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

function aggregateStats(state) {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (state.board[i][j].unit) {
        let start = { i, j };
        let unit = state.board[i][j].unit;
        unit.aggregateDefense = unit.defense;
        state.board[i][j].feature.defense ?
          unit.aggregateDefense += state.board[i][j].feature.defense :
          unit.aggregateDefense += 0;
        unit.aggregateAttack = 0;
        let cellsToCheck = [
          [i-3,j-3],                    [i-3,j  ],                    [i-3,j+3],
                    [i-2,j-2],          [i-2,j  ],          [i-2,j+2],
                              [i-1,j-1],[i-1,j  ],[i-1,j+1],
          [i  ,j-3],[i  ,j-2],[i  ,j-1],[i  ,j  ],[i  ,j+1],[i  ,j+2],[i  ,j+3],
                              [i+1,j-1],[i+1,j  ],[i+1,j+1],
                    [i+2,j-2],          [i+2,j  ],          [i+2,j+2],
          [i+3,j-3],                    [i+3,j  ],                    [i+3,j+3]
        ];

        cellsToCheck.forEach(
          function(cell) {
            if (
              state.board[cell[0]] != undefined &&
              state.board[cell[0]][cell[1]] != undefined
            ) {
              let end = {
                i: cell[0],
                j: cell[1]
              };
              let nUnit = state.board[cell[0]][cell[0]].unit;

              // aggregates defense
              if (
                nUnit &&
                nUnit.player.id == unit.player.id &&
                nUnit.range >= distance(start, end)
              ) {
                unit.aggregateDefense += nUnit.defense;
              };

              // aggregate attack
              if (
                nUnit &&
                nUnit.player.id != unit.player.id &&
                nUnit.range >= distance(start, end)
              ) {
                unit.aggregateAttack += nUnit.attack;
              };
            };
          }
        )
      }
    }
  }
}

/*
Communication lines
*/


function radiateLines(id, state) {
  // get positions of arsenals and relays
  let comPos = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (
        (state.board[i][j].arsenal &&
        state.board[i][j].arsenal.player.id == id) ||
        (state.board[i][j].online.includes(id) &&
        state.board[i][j].unit &&
        state.board[i][j].unit.name == ("relay" || "swiftRelay") &&
        state.board[i][j].unit.player.id == id)
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
          if (!state.board[i][j].online.includes(id)) {
            state.board[i][j].online.push(id);
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
        state.board[i][j].online.includes(id) &&
        state.board[i][j].unit &&
        state.board[i][j].unit.player.id == id
      ) {
        adjecentCells.forEach(
          (val) => {
            k = val[0];
            l = val[1];
            if (
              state.board[k] != undefined &&
              state.board[k][l] != undefined &&
              state.board[k][l].feature.traversable &&
              !state.board[k][l].online.includes(id)
            ) {
              state.board[k][l].online.push(id);
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
  radiateLines,
  aggregateStats,
  deselect
}