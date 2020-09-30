const {
  ROWS,
  COLS,
  A_COLOR,
  B_COLOR
} = require("../constants");

const empty = {
  name: "empty",
  traversable: true,
}

let empt = {
  feature: empty,
  arsenal: null,
  unit: null,
  online: []
}

const mountain = {
  name: "mountain",
  traversable: false,
}

let mntn = {
  feature: mountain,
  arsenal: null,
  unit: null,
  online: []
}

const fortification = {
  name: "fortification",
  traversable: true,
  defense: 4,
}

let fort = {
  feature: fortification,
  arsenal: null,
  unit: null,
  online: []
}

const mountainPass = {
  name: "mountainPass",
  traversable: true,
  defense: 2
}

let mnps = {
  feature: mountainPass,
  arsenal: null,
  unit: null,
  online: []
}

const matrix = [
/*     0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24*/
/* 0*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 1*/[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 2*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 3*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 4*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 5*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 6*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 7*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
/* 8*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* 9*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*10*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*11*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*12*/[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*13*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*14*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*15*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*16*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*17*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*18*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*19*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
/*
  Map initial matrix to an object matrix
  */
let board = matrix.map(
  (row, i) => row.map(
    (cel, j) => {
      cel == 0 ?
      cel = { feature: empty, arsenal: null, unit: null, online: new Array(), i, j } :
      cel == 1 ?
      cel = { feature: fortification, arsenal: null, unit: null, online: new Array(), i, j } :
      cel == 2 ?
      cel = { feature: mountain, arsenal: null, unit: null, online: new Array(), i, j } :
      cel = { feature: mountainPass, arsenal: null, unit: null, online: new Array(), i, j };
      return cel;
    }
));
// const board = matrix.map(y => y.map(x => x));


/*
let board = matrix.forEach(
  (row, i) => {
    row.forEach(
      (cell, j) => {
        cell;
        cell.i = i;
        cell.j = j;
      }
    )
  }
)*/

/*class Board {
  constructor(rows = 20, cols = 25) {

    this.rows = 20;
    this.cols = 25;
    this.featureMatrix = featureMatrix;
    this.arsenalMatrix = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    this.unitMatrix = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
  }
}*/

module.exports = {
  board
}
