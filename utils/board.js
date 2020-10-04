const {
  ROWS,
  COLS,
  A_COLOR,
  B_COLOR
} = require("../constants");

/*
Terrain features
*/
const empty = {
  name: "empty",
  traversable: true,
}

const mountain = {
  name: "mountain",
  traversable: false,
}

const fortification = {
  name: "fortification",
  traversable: true,
  defense: 4,
}

const mountainPass = {
  name: "mountainPass",
  traversable: true,
  defense: 2
}

/*
Arsenal
*/
class Arsenal {
  constructor(player) {
    this.name = "arsenal";
    this.player = player;
  }
};

/*
Units
*/
class Relay {
  constructor(player) {
    this.name = "relay";
    this.player = player;

    this.moves = {
      curr: 1,
      init: 1,
    };
    this.defense = 1;
    this.comms = true;

    this.reset = () => {
      this.moves.curr = this.moves.init;
    }
  }
}

class SwiftRelay {
  constructor(player) {
    this.name = "swiftRelay";
    this.player = player;

    this.moves = {
      curr: 2,
      init: 2,
    };
    this.defense = 1;
    this.comms = true;

    this.reset = () => {
      this.moves.curr = this.moves.init;
    }
  }
}

class Infantry {
  constructor(player) {
    this.name = "infantry";
    this.player = player;

    this.moves = {
      curr: 1,
      init: 1,
    };
    this.range = 2;
    this.attack = 4;
    this.defense = 6;

    this.reset = () => {
      this.moves.curr = this.moves.init;
    }
  }
}

class Cavalry {
  constructor(player) {
    this.name = "cavalry";
    this.player = player;

    this.moves = {
      curr: 2,
      init: 2
    };
    this.range = 2;
    this.attack = 4;
    this.defense = 5;
    this.charge = true;

    this.reset = () => {
      this.moves.curr = this.moves.init;
    }
  }
}

class Cannon {
  constructor(player) {
    this.name = "cannon";
    this.player = player;

    this.moves = {
      curr: 1,
      init: 1
    };
    this.range = 3;
    this.attack = 5;
    this.defense = 8;

    this.reset = () => {
      this.moves.curr = this.moves.init;
    }
  }
}

class SwiftCannon {
  constructor(player) {
    this.name = "swiftCannon";
    this.player = player;

    this.moves = {
      curr: 2,
      init: 2
    };
    this.range = 3;
    this.attack = 5;
    this.defense = 8;

    this.reset = () => {
      this.moves.curr = this.moves.init;
    }
  }
}

/*
Players
*/
class Player {
  constructor(turn, color) {
    this.turn = turn;
    this.color = color;
    this.moves = 0;
    this.attacks = 0;
    this.units = 0;
    this.ready = false;
  }
}

const playerA = new Player(true, A_COLOR);
const playerB = new Player(false, B_COLOR);

/*
Board
*/
class Cell {
  constructor(feature = empty, arsenal = null, unit = null, position) {
    this.feature = feature;
    this.arsenal = arsenal;
    this.unit = unit;
    this.online = new Array();
    this.pos = { i: position.i, j: position.j}
  }
}

// initial board (mikanovic notation*)
const initString = 
  "10,25." +
  "A19,2;19,22" +
  "B3,7;1,14" +
  "F1,7;8,12;7,20;12,2;11,14;14,22" +
  "M2,9;2,10;2,11;2,12;3,9;4,9;6,9;7,9;8,9;13,10;13,11;13,12;13,13;13,14;13,15;15,15;16,15;17,15" +
  "P5,9;14,15."

function makeBoard(string) {
  let meta = string.split(".")[0];
  let init = string.split(".")[1];

  let as = init.match(/A.*?(?=[A-Z]|\.|$)/)[0]; // match A arsenals
  let bs = init.match(/B.*?(?=[A-Z]|\.|$)/)[0]; // match B arsenals
  let fs = init.match(/F.*?(?=[A-Z]|\.|$)/)[0]; // match Forts
  let ms = init.match(/M.*?(?=[A-Z]|\.|$)/)[0]; // match Mountains
  let ps = init.match(/P.*?(?=[A-Z]|\.|$)/)[0]; // match mountain Passes

  let rows = meta.split(",")[0] * 2;
  let cols = meta.split(",")[1]

  let board = [...Array(rows)].map(e => Array(cols));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let pos = { i, j };
      board[i][j] = new Cell(empty, null, null, pos);
    }
  }

  // insert forts
  fs = fs.substring(1);
  fs.split(";").forEach(
    coord => {
      let i = coord.split(",")[0];
      let j = coord.split(",")[1];
      board[i][j].feature = fortification;
    }
  )

  // insert mountains
  ms = ms.substring(1);
  ms.split(";").forEach(
    coord => {
      let i = coord.split(",")[0];
      let j = coord.split(",")[1];
      board[i][j].feature = mountain;
    }
  )

  // insert mountain passes
  ps = ps.substring(1);
  ps.split(";").forEach(
    coord => {
      let i = coord.split(",")[0];
      let j = coord.split(",")[1];
      board[i][j].feature = mountainPass;
    }
  )

  // insert arsenals A
  as = as.substring(1);
  as.split(";").forEach(
    coord => {
      let i = coord.split(",")[0];
      let j = coord.split(",")[1];
      board[i][j].arsenal = new Arsenal(playerA);
    }
  )

  // insert arsenals B
  bs = bs.substring(1);
  bs.split(";").forEach(
    coord => {
      let i = coord.split(",")[0];
      let j = coord.split(",")[1];
      board[i][j].arsenal = new Arsenal(playerB);
    }
  )

  return board;
}

module.exports = {
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
}
