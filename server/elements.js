/*
Features
*/
class Mountain {
  constructor(position) {
    this.name = "mountain";
    this.pos = {
      i: position.i,
      j: position.j
    };
    this.traversable = false;
  }

  // draw mountain
  draw() {
    ctx.fillStyle = "#333";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (11/12 * cell.height),
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (1/12 * cell.height),
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (11/12 * cell.height),
    );
    ctx.closePath();
    ctx.fill();
  };
}

class MountainPass {
  constructor(position) {
    this.name = "mountainPass";
    this.pos = {
      i: position.i,
      j: position.j
    }
    this.defense = 2;
    this.traversable = true;
  }

  // draw mountainPass
  draw() {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (1/12 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (1/6 * cell.width),
      (this.pos.i * cell.height) + (1/6 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (5/6 * cell.width),
      (this.pos.i * cell.height) + (1/6 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (1/12 * cell.height)
    );
    ctx.moveTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (11/12 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (5/6 * cell.width),
      (this.pos.i * cell.height) + (5/6 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (1/6 * cell.width),
      (this.pos.i * cell.height) + (5/6 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (11/12 * cell.height)
    );
    ctx.stroke();
  }
}

class Fort {
  constructor(position) {
    this.name = "fort";
    this.pos = {
      i: position.i,
      j: position.j
    }
    this.defense = 4;
    this.traversable = true;
  }

  // draw fort
  draw() {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (1/12 * cell.height),
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (1/12 * cell.height),
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (11/12 * cell.height),
    );
    ctx.closePath();
    ctx.stroke();
  }
}
/*
Arsenal
*/
class Arsenal {
  constructor(position, player) {
    this.name = "arsenal";
    this.pos = {
      i: position.i,
      j: position.j,
    };
    this.traversable = true;

    this.player = player;
    this.color = player.color;
  }

  // draw arsenal
  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (0 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height),
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (1 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height),
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (1 * cell.height),
    );
    ctx.closePath();
    ctx.stroke();
  }
};

class Relay {
  constructor(position, player) {
    this.name = "relay";
    this.pos = {
      i: position.i,
      j: position.j
    };

    this.player = player;
    this.color = player.color;

    this.moves = {
      curr: 1,
      init: 1,
    };
    this.range = 1;
    this.comms = true;
  }

  // draw relay
  draw() {
    // unit rect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );
    // relay
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height)
    );
    ctx.stroke();
  }

  // reset relay
  reset() {
    this.moves.curr = this.moves.init;
  }
}

class SwiftRelay {
  constructor(position, player) {
    this.name = "swiftRelay";
    this.pos = {
      i: position.i,
      j: position.j
    };

    this.player = player;
    this.color = player.color;

    this.moves = {
      curr: 2,
      init: 2,
    };
    this.range = 1;
    this.comms = true;
  }

  // draw swiftRelay
  draw() {
    // unit rect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );
    // swift circs
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      (this.pos.j * cell.width) + (2/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height),
      cell.width * 1/24,
      0,
      Math.PI * 2,
      true
    );
    ctx.moveTo(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height)
    );
    ctx.arc(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height),
      cell.width * 1/24,
      0,
      Math.PI * 2,
      true
    );
    ctx.moveTo(
      (this.pos.j * cell.width) + (4/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height)
    )
    ctx.arc(
      (this.pos.j * cell.width) + (4/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height),
      cell.width * 1/24,
      0,
      Math.PI * 2,
      true
    );
    ctx.fill();
    // relay
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height)
    );
    ctx.stroke();
  }

  // reset swiftRelay
  reset() {
    this.moves.curr = this.moves.init;
  }
}

class Infantry {
  constructor(position, player) {
    this.name = "infantry";
    this.pos = {
      i: position.i,
      j: position.j
    };

    this.player = player;
    this.color = player.color;

    this.moves = {
      curr: 1,
      init: 1,
    };
    this.range = 2;
    this.attack = 4;
    this.defense = 6;
  }

  // draw infantry
  draw() {
    // unit rect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );
    // draw infantry
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (9/12 * cell.height)
    );
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (9/12 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height)
    );
    ctx.stroke();
  }

  // reset infantry
  reset() {
    this.moves.curr = this.moves.init;
  }
}

class Cavalry {
  constructor(postion, player) {
    this.name = "cavalry";
    this.pos = {
      i: position.i,
      j: position.j
    };

    this.player = player;
    this.color = player.color;

    this.moves = {
      curr: 2,
      init: 2
    };
    this.range = 2;
    this.attack = 4;
    this.defense = 5;
    this.charge = true;
  }

  // draw cavalry
  draw() {
    // unit rect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );
    // draw cavalry
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height)
    );
    ctx.lineTo(
      (this.pos.j * cell.width) + (11/12 * cell.width),
      (this.pos.i * cell.height) + (9/12 * cell.height)
    );
    ctx.stroke();
  }

  // reset cavalry
  reset() {
    this.moves.curr = this.moves.init;
  }
}

class Cannon {
  constructor(position, player) {
    this.name = "cannon";
    this.pos = {
      i: position.i,
      j: position.j
    };

    this.player = player;
    this.color = player.color;

    this.moves = {
      curr: 1,
      init: 1
    };
    this.range = 3;
    this.attack = 5;
    this.defense = 8;
  }

  // draw cannon
  draw() {
    // unit rect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );
    // unit path
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height)
    );
    ctx.arc(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height),
      cell.width * 1/12,
      0,
      Math.PI * 2,
      true
    );
    ctx.fill();
  }

  // reset cannon
  reset() {
    this.moves.curr = this.moves.init;
  }
}

class SwiftCannon {
  constructor(position, player) {
    this.name = "swiftCannon";
    this.pos = {
      i: position.i,
      j: position.j
    };

    this.player = player;
    this.color = player.color;

    this.moves = {
      curr: 2,
      init: 2
    };
    this.range = 3;
    this.attack = 5;
    this.defense = 8;
  }

  // draw swiftCannon
  draw() {
    // unit rect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      (this.pos.j * cell.width) + (1/12 * cell.width),
      (this.pos.i * cell.height) + (3/12 * cell.height),
      cell.width * 5/6,
      cell.height * 3/6
    );
    // swift circs
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      (this.pos.j * cell.width) + (2/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height),
      cell.width * 1/24,
      0,
      Math.PI * 2,
      true
    );
    ctx.moveTo(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height)
    );
    ctx.arc(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height),
      cell.width * 1/24,
      0,
      Math.PI * 2,
      true
    );
    ctx.moveTo(
      (this.pos.j * cell.width) + (4/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height)
    )
    ctx.arc(
      (this.pos.j * cell.width) + (4/6 * cell.width),
      (this.pos.i * cell.height) + (4/6 * cell.height),
      cell.width * 1/24,
      0,
      Math.PI * 2,
      true
    );
    ctx.fill();
    // unit path
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height)
    );
    ctx.arc(
      (this.pos.j * cell.width) + (3/6 * cell.width),
      (this.pos.i * cell.height) + (3/6 * cell.height),
      cell.width * 1/12,
      0,
      Math.PI * 2,
      true
    );
    ctx.fill();
  }

  // reset swiftCannon
  reset() {
    this.moves.curr = this.moves.init;
  }
}
