/*
Arsenal
*/
class Arsenal {
  constructor(player) {
    this.name = "arsenal";
    this.traversable = true;

    this.player = player;
  }
};

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

module.exports = {
  Arsenal,
  Relay,
  SwiftRelay,
  Infantry,
  Cavalry,
  Cannon,
  SwiftCannon
}