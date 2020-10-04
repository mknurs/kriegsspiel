/*
Global variables
*/
/*
Board data
*/
// 0 == empty, 1 == fort, 2 == mountain, 3 == mountainPass
const initGameMatrix = [
  /*    1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25*/
  /*A*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*B*/[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*C*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*D*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*E*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*F*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*G*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*H*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  /*I*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*J*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*K*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*L*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*M*/[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*N*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*O*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*P*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*Q*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*R*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*S*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*T*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // get rows and cols from initial matrix
  const rows = initGameMatrix.length;
  const cols = initGameMatrix.reduce((pre, cur) => {return pre.length > cur.length ? cur : pre}).length;
  
  /*
  SVG constants
  */
  // side dimension of square
  const side = 60;
  // width and height of svg canvas
  const width = side * cols;
  const height = side * rows;
  // svg canvas
  const container = (new SVG)
    .attr({
      viewBox: "0 0 " + width + " " + height, 
      id: "gameContainer",
    }).addTo("#kriegsspiel");
  const board = (new SVG.G)
    .attr({
      id: "board"
    }).addTo(container);
  // layer for features
  const featureLayer = (new SVG.G)
    .attr({
      id: "featureLayer",
    }).addTo(board);
  // layer for metadata
  const metaLayer = (new SVG.G)
    .attr({
      id: "metaLayer"
    }).addTo(container);
  // divisor line
  const divisorLines = (new SVG.G)
  .attr({
    id: "divisorLines",
  }).addTo(board);
  divisorLines.path()
    .attr({
      d: "M 0 " + ((height / 2) + (side / 24)) + " h " + width,
      class: "A",
    });
  divisorLines.path()
    .attr({
      d: "M 0 " + ((height / 2) - (side / 24)) + " h " + width,
      class: "B",
    });
  // coordinate labels
  const coordLabels = (new SVG.G)
    .attr({
      id: "coordLabels",
    }).addTo(metaLayer)
  for (let i = 0; i < rows; i++) {
    coordLabels.text(i.toString())
      .attr({
        x: 0.5 * side,
        y: i * side,
        class: "coordText",
      }).font({anchor: "middle"});
  };
  for (let j = 1; j < cols; j++) {
    coordLabels.text(j.toString())
      .attr({
        x: (j + 0.5) * side,
        y: 0,
        class: "coordText",
      }).font({anchor: "middle"});
  };
  // layer for communication lines
  const commLayer = (new SVG.G)
    .attr({
      id: "commLayer"
    }).addTo(board);
  // layer for units
  const unitLayer = (new SVG.G)
    .attr({
      id: "unitLayer",
    }).addTo(board);
  
  /*
  Drawing functions
  */
  const drawEmptyBase = function(i, j) {
    let emptyBase = (new SVG.G)
      .attr({class: "feature"});
    emptyBase.rect()
      .attr({
        width: side,
        height: side,
        x: j * side,
        y: i * side,
        class: "baseSquare"
      });
    return emptyBase;
  };
  const drawMountain = function(i, j) {
    let mountain = drawEmptyBase(i, j)
      .attr({class: "feature"});
    let x = j * side;
    let y = i * side;
    mountain.path()
      .attr({
        d: "M" + x + " " + y + " " +
        "m" + (3 / 6 * side) + " " + (1 / 6 * side) + " " +
        "l" + (2 / 6 * side) + " " + (4 / 6 * side) + " " +
        "h" + (- 4 / 6 * side) + " " +
        "z",
        class: "mountain",
      });
    return mountain;
  };
  const drawFort = function(i, j) {
    let fort = drawEmptyBase(i, j)
      .attr({class: "feature"});
    let x = j * side;
    let y = i * side; 
    fort.path()
      .attr({
          d: "M" + x + " " + y + " " +
          "m" + (1 / 6 * side) + " " + (1 / 6 * side) + " " +
          "h" + (4 / 6 * side) + " " +
          "l" + (- 2 / 6 * side) + " " + (4 / 6 * side) + " " +
          "z",
          class: "fort",
        });
    return fort;
  };
  const drawMountainPass = function(i, j) {
    let mountainPass = drawEmptyBase(i, j)
      .attr({class: "feature"});
    let x = j * side;
    let y = i * side;
    mountainPass.path()
      .attr({
        d: "M" + x + " " + y + " " +
        "m" + (1 / 6 * side) + " " + (1 / 6 * side) + " " +
        "l" + (1 / 6 * side) + " " + (1 / 6 * side) + " " +
        "h" + (2 / 6 * side) + " " +
        "l" + (1 / 6 * side) + " " + (- 1 / 6 * side) + " " +
        "m" + 0 + " " + (4 / 6 * side) + " " +
        "l" + (- 1 / 6 * side) + " " + (- 1 / 6 * side) + " " +
        "h" + (- 2 / 6 * side) + " " +
        "l" + (- 1 / 6 * side) + " " + (1 / 6 * side),
        class: "mountainPass"
      });
    return mountainPass;
  };
  const drawArsenal = function(i, j) {
    let arsenal = drawEmptyBase(i, j)
      .attr({class: "feature"});
    let x = j * side;
    let y = i * side;
    arsenal.path()
      .attr({
        d: "M" + x + " " + y + " " +
        "m" + (1 / 12 * side) + " " + (3 / 6 * side) + " " +
        "h" + (5 / 6 * side) + " " +
        "l" + (- 5 / 12 * side) + " " + (3 / 6 * side) + " " +
        "z",
        class: "arsenal"
      });
    return arsenal;
  };
  const drawUnitBase = function(i, j) {
    let unitBase = new SVG.G;
    unitBase.rect()
      .attr({
        width: side,
        height: side,
        x: j * side,
        y: i * side,
        class: "hidden",
      });
    unitBase.rect()
      .attr({
        width: 5 / 6 * side,
        height: 3 / 6 * side,
        x: (j * side) + (1 / 12 * side),
        y: (i * side) + (3 / 12 * side),
      });
    return unitBase;
  };
  const drawSwiftBase = function(i, j) {
    let swiftBase = new SVG.G;
    let x = j * side;
    let y = i * side;
    swiftBase.circle(1 / 12 * side).center(x + (2 / 6 * side), y + (4 / 6 * side));
    swiftBase.circle(1 / 12 * side).center(x + (3 / 6 * side), y + (4 / 6 * side));
    swiftBase.circle(1 / 12 * side).center(x + (4 / 6 * side), y + (4 / 6 * side));
    return swiftBase;
  };
  /*const drawArsenal = function(i, j) {
    let arsenal = drawUnitBase(i, j)
      .attr({class: "unit arsenal"});
    let x = j * side;
    let y = i * side;
    arsenal.path()
      .attr({
        d: "M" + x + " " + y + " " +
        "m" + (1 / 12 * side) + " " + (3 / 6 * side) + " " +
        "h" + (5 / 6 * side) + " " +
        "l" + (- 5 / 12 * side) + " " + (3 / 6 * side) + " " +
        "z",
      });
    return arsenal;
  };*/
  const drawRelay = function(i, j) {
    let relay = drawUnitBase(i, j)
      .attr({class: "unit relay"});
    let x = j * side;
    let y = i * side;
    relay.path()
      .attr({
        d: "M" + x + " " + y + " " +
        "m" + (1 / 12 * side) + " " + (3 / 6 * side) + " " +
        "h" + (5 / 6 * side),
      });
    return relay;
  };
  const drawSwiftRelay = function(i, j) {
    let swiftRelay = drawRelay(i, j)
      .attr({class: "unit swiftRelay"});
    drawSwiftBase(i, j).addTo(swiftRelay);
    return swiftRelay;
  };
  const drawInfantry = function(i, j) {
    let infantry = drawUnitBase(i, j)
      .attr({class: "unit infantry"});
    let x = j * side;
    let y = i * side;
    infantry.path()
      .attr({
        d: "M" + x + " " + y + " " +
        "m" + (1 / 12 * side) + " " + (3 / 12 * side) + " " +
        "l" + (5 / 6 * side) + " " + (3 / 6 * side) + " " +
        "m" + 0 + " " + (- 3 / 6 * side) + " " +
        "l" + (- 5 / 6 * side) + " " + (3 / 6 * side),
      });
    return infantry;
  };
  const drawCavalry = function(i, j) {
    let cavalry = drawUnitBase(i, j)
      .attr({class: "unit cavalry"});
    let x = j * side;
    let y = i * side;
    cavalry.path()
      .attr({
        d: "M" + x + " " + y + " " +
        "m" + (1 / 12 * side) + " " + (3 / 12 * side) + " " +
        "l" + (5 / 6 * side) + " " + (3 / 6 * side),
      });
    return cavalry;
  };
  const drawCannon = function(i, j) {
    let cannon = drawUnitBase(i, j)
      .attr({class: "unit cannon"});
    let x = j * side;
    let y = i * side;
    cannon.circle(1 / 6 * side).center(x + (side / 2), y + (side / 2));
    return cannon;
  };
  const drawSwiftCannon = function(i, j) {
    let swiftCannon = drawCannon(i, j)
      .attr({class: "unit swiftCannon"});
    drawSwiftBase(i, j).addTo(swiftCannon);
    return swiftCannon;
  };
  
  /*
  Class definitions
  */
  class Player {
    constructor(name, turn) {
      this.name = name;
      this.turn = turn;
      this.placedUnits = 0;
      this.movedUnits = 0;
      this.attackedUnits = 0;
    };
  };
  class Feature {
    constructor(name, traversable, defense, draw, communication = false) {
      this.name = name;
      this.traversable = traversable;
      this.defense = defense;
      this.draw = draw;
      this.communication = communication;
    };
  };
  class Unit {
    constructor(name, moves, range, attack, defense, draw, communication = false, charge = false) {
      this.name = name;
      this.moves = moves;
      this.initialMoves = this.moves;
      this.range = range;
      this.attack = attack;
      this.defense = defense;
      this.draw = draw;
      this.communication = communication;
      this.charge = charge;
      this.retreat = false;
    };
  };
  class Situation {
    constructor(i, j, feature, unit = null, player = null) {
      this.i = i;
      this.j = j;
      this.feature = feature;
      this.unit = unit;
      this.player = player;
      this.online = [];
      this.info = feature.name;
      if (this.unit != null && this.player != null) {
        this.info = this.info + ", " + unit.name + "(" + unit.moves + ")" + ", " + player.name
      };
      this.aggregateDefense = this.feature.defense;
      this.aggregateAttack = 0;
    };
  
    draw() {
      let i = this.i;
      let j = this.j;
      let feature, featureSprite;
      let unit, unitSprite;
      let player;
      // draws feature
      if (this.feature != null) {
        feature = this.feature;
        featureSprite = feature.draw(i, j);
        featureSprite.addTo(featureLayer);
        if (this.player != null) {
          player = this.player;
          featureSprite.addClass(player.name);
        };
      };
      // draws unit
      if (this.unit != null && this.player != null) {
        unit = this.unit;
        player = this.player;
        unitSprite = unit.draw(i, j);
        unitSprite
          .addClass(player.name).addTo(unitLayer);
      };
      // draws online mark
      let online = this.online;
      if (online.length > 0) {
        if (online.includes(a)) {
          commLayer.circle(side / 12).center((j * side) + (side / 2), (i * side) + (side / 2)).addClass(a.name);
        };
        if (online.includes(b)) {
          commLayer.circle(side / 12).center((j * side) + (side / 2), (i * side) + (side / 2)).addClass(b.name);
        };
      };
      // colors selected squares
      if (
        gameState.selectedSquare != null &&
        gameState.selectedSquare.i == i &&
        gameState.selectedSquare.j == j
      ) {
        featureSprite.addClass("selected");
        if (this.unit != null) {
          unitSprite.addClass("selected");
        }
      }
  
      // flips square
      if (gameState.turn == false) {
        featureSprite.rotate(180);
        if (this.unit != null) {
          unitSprite.rotate(180)
        }
      };
  
      // draws stats
      if (this.unit != null) {
        let stat = (this.aggregateDefense - this.aggregateAttack).toString();
        unitSprite
          .plain(stat)
          .font({anchor: "middle"})
          .attr({
            x: (j * side) + (side / 2),
            y: (i * side) + side,
            class: "stat",
          });
      };
      // draws stats on selected square
      if (
        this.unit != null &&
        gameState.selectedSquare != null &&
        gameState.selectedSquare.i == i &&
        gameState.selectedSquare.j == j
      ) {
        let moves = this.unit.moves.toString();
        let range = this.unit.range.toString();
        let attack = this.unit.attack.toString();
        let defense = this.unit.defense.toString();
        unitSprite
          .plain(moves)
          .font({anchor: "start"})
          .attr({
            x: j * side,
            y: i * side,
            class: "stat",
          });
        unitSprite
          .plain(range)
          .font({anchor: "end"})
          .attr({
            x: (j * side) + side,
            y: i * side,
            class: "stat",
          });
        unitSprite
          .plain(attack)
          .font({anchor: "start"})
          .attr({
            x: j * side,
            y: (i * side) + side,
            class: "stat",
          });
        unitSprite
          .plain(range)
          .font({anchor: "end"})
          .attr({
            x: (j * side) + side,
            y: (i * side) + side,
            class: "stat",
          });
      }
  
      // hide enemy units and communications before battle
      if (gameState.battle == false) {
        featureLayer.find("." + gameState.playerNotOnTurn.name).find(".arsenal").hide();
        unitLayer.find("." + gameState.playerNotOnTurn.name).hide();
        commLayer.find("." + gameState.playerNotOnTurn.name).hide();
      };
  
      // click events
      featureSprite.click(
        function() {
          if (gameState.selectedSquare == null) {
            gameState.selectedSquare = gameMatrix[i][j];
            gameLoop();
          } else {
            gameState.targetedSquare = gameMatrix[i][j];
            gameLoop();
          };
        }
      );
    };
  };
  
  /*
  Object definitions
  */
  // player objects
  const a = new Player("A", true);
  const b = new Player("B", false);
  // feature objects
  const empty = new Feature("empty", true, 0, drawEmptyBase);
  const mountain = new Feature("mountain", false, 0, drawMountain);
  const mountainPass = new Feature("mountain pass", true, 2, drawMountainPass);
  const fort = new Feature("fort", true, 4, drawFort);
  const arsenal = new Feature("arsenal", true, 0, drawArsenal, true)
  // unit objects
  // const arsenal = new Unit("arsenal", 0, 0, 0, 0, drawArsenal, true);
  const relay = new Unit("relay", 1, 0, 0, 1, drawRelay, true);
  const swiftRelay = new Unit("swift relay", 2, 0, 0, 1, drawSwiftRelay, true);
  const infantry = new Unit("infantry", 1, 2, 4, 6, drawInfantry);
  const cavalry = new Unit("cavalry", 2, 2, 4, 5, drawCavalry, false, true);
  const cannon = new Unit("cannon", 1, 3, 5, 8, drawCannon);
  const swiftCannon = new Unit("swift cannon", 2, 3, 5, 8, drawSwiftCannon);
  
  /*
  Game state
  */
  const gameState = {
    turn: true,
    lastTurn: true,
    battle: false,
    alert: "",
  
    selectedSquare: null,
    targetedSquare: null,
  
    players: [a, b],
    playerUnits: [
      arsenal,
      arsenal,
      relay,
      swiftRelay,
      infantry,
      infantry,
      infantry,
      infantry,
      infantry,
      infantry,
      infantry,
      infantry,
      infantry,
      cavalry,
      cavalry,
      cavalry,
      cavalry,
      cannon,
      swiftCannon
    ],
    //playerUnits: [arsenal, infantry],
    playerMoves: 5,
    playerAttacks: 1,
  };
  gameState.playerOnTurn = gameState.players.find(player => player.turn == gameState.turn);
  gameState.playerNotOnTurn = gameState.players.find(player => player.turn != gameState.turn);
  /*
  Info elements
  */
  const infoContainer = (new SVG)
    .attr({
      viewBox: "0 0 " + width + " " + side, 
      id: "infoContainer",
    }).addTo("#kriegsspiel");
  const endTurn = (new SVG.Text)
    .plain("End turn >>")
    .attr({
      x: width - (side / 2),
      y: side / 2,
      id: "endTurn"
    })
    .font({anchor: "end"})
    .click(
      function() {
        nextTurn();
        gameLoop();
      }
    )
    .addTo(infoContainer);
  const currentInfo = (new SVG.Text)
    .attr({
      x: side / 2,
      y: side / 2,
      class: "currentInfo",
    })
    .addTo(infoContainer);
  /*
  Map initial matrix to an object matrix
  */
  let gameMatrix = initGameMatrix.map((x, idxi) => x.map(
    (val, idxj) => {
      val == 0 ?
      val = new Situation(idxi, idxj, empty) :
      val == 1 ?
      val = new Situation(idxi, idxj, fort) :
      val == 2 ?
      val = new Situation(idxi, idxj, mountain) :
      val = new Situation(idxi, idxj, mountainPass);
      return val;
    }
  ));
  
  // refresh communication
  // iterates and finds units that radiate communications
  function getCommPos(player) {
    let commPos = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let cell = gameMatrix[i][j];
        if (
          (cell.feature.communication ||
          (cell.unit != null && 
          cell.unit.communication &&
          cell.online.includes(player))) && 
          cell.player == player
        ) {
          commPos.push([i, j]);
        };
      };
    };
    return commPos;
  };
  function radiateComms(player) {
    let commPos = getCommPos(player);
    for (let k = 0; k < commPos.length; k++) {
      let directions = [
        [-1, -1], [-1,  0], [-1, +1],
        [ 0, -1],           [ 0, +1],
        [+1, -1], [+1,  0], [+1, +1]
      ];
      let i = commPos[k][0];
      let j = commPos[k][1];
      let cell = gameMatrix[i][j];
      directions.forEach(
        function(direction) {
          i = commPos[k][0];
          j = commPos[k][1];
          cell = gameMatrix[i][j];
          while (cell != undefined && cell.feature.traversable) {
            if (cell.online.includes(player) == false) {
              cell.online.push(player);
            };
            i = i + direction[0];
            j = j + direction[1];
            if (gameMatrix[i] != undefined && gameMatrix[i][j] != undefined) {
              cell = gameMatrix[i][j];
            } else {
              break;
            }
          };
        }
      );
    };
  };
  function adjecentComms(player) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let cell = gameMatrix[i][j];
        let adjecentCells = [
          [i-1,j-1],[i-1,  j],[i-1,j+1],
          [i  ,j-1],          [i  ,j+1],
          [i+1,j-1],[i+1,  j],[i+1,j+1],
        ];
        if (cell.online.includes(player) && cell.unit != null && cell.player == player) {
          adjecentCells.forEach(
            (val) => {
              let i = val[0];
              let j = val[1];
              if (gameMatrix[i] != undefined && gameMatrix[i][j] != undefined && gameMatrix[i][j].feature.traversable && gameMatrix[i][j].online.includes(player) == false) {
                gameMatrix[i][j].online.push(player);
              };
            }
          );
        };
      };
    };
  };
  function aggregateStats() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let cell = gameMatrix[i][j];
        cell.aggregateDefense = cell.feature.defense;
        cell.aggregateAttack = 0;
        if (cell.unit != null) {
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
              if (gameMatrix[val[0]] != undefined && gameMatrix[val[0]][val[1]] != undefined) {
                let square = gameMatrix[val[0]][val[1]];
                if (
                  square.unit != null &&
                  square.player == cell.player &&
                  square.unit.range >= distance(cell, square)
                ) {
                  cell.aggregateDefense += square.unit.defense;
                };
                if (
                  square.unit != null &&
                  square.player != cell.player &&
                  square.unit.range >= distance(cell, square)
                ) {
                  cell.aggregateAttack += square.unit.attack;
                };
              };
            }
          );
        };
      };
    };
  };
  function checkRetreat(targeted) {
    let i = targeted.i;
    let j = targeted.j;
    let moves = targeted.unit.moves;
    let validRetreat = []
    for (let k = i - moves; k <= i + moves; k++) {
      for (let l = j - moves; l <= j + moves; l++) {
        if (gameMatrix[k][l].unit != null) {
          validRetreat.push([k, l]);
        };
      };
    };
    if (validRetreat.length > 0) {
      return true;
    } else {
      return false;
    };
  };
  function nextTurn() {
    gameState.turn = !gameState.turn;
    gameState.playerOnTurn = gameState.players.find(player => player.turn == gameState.turn);
    gameState.playerNotOnTurn = gameState.players.find(player => player.turn != gameState.turn);
  
    // reset moves
    gameState.playerOnTurn.movedUnits = 0;
    gameState.playerNotOnTurn.movedUnits = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let cell = gameMatrix[i][j]
        if (cell.unit != null) {
          switch (cell.unit.name) {
            case "relay":
              cell.unit.moves = 1;
              break;
            case "swift relay":
              cell.unit.moves = 2;
              break;
            case "infantry":
              cell.unit.moves = 1;
              break;
            case "cavalry":
              cell.unit.moves = 2;
              break;
            case "cannon":
              cell.unit.moves = 1;
              break;
            case "swift cannon":
              cell.unit.moves = 2;
              break;
            default:
              break;
          };
        };
      };
    };
    // reset clicked
    // resetClicked();
  };
  function resetClicked() {
    gameState.selectedSquare = null;
    gameState.targetedSquare = null;
  };
  function distance(start, end) {
    let i = Math.abs(start.i - end.i);
    let j = Math.abs(start.j - end.j);
    // if diagonal moves are NOT allowed
    // return i + j;
    // if diagonal moves are allowed
    return Math.max(i, j)
  };
  // loop
  function gameLoop() {
    // clear last state
    featureLayer.clear();
    unitLayer.clear();
    commLayer.clear();
    radiateComms(a);
    radiateComms(b);
    adjecentComms(a);
    adjecentComms(b);
  
    // process clicks
    {
      let player = gameState.playerOnTurn;
      let enemy = gameState.playerNotOnTurn;
      if (gameState.battle == false) {
        gameState.selectedSquare = gameState.playerUnits[player.placedUnits];
      };
      if (
        gameState.selectedSquare != null &&
        gameState.targetedSquare != null
      ) {
        let selected = gameState.selectedSquare;
        let targeted = gameState.targetedSquare;
        if ( // move
          gameState.battle &&
          selected.player == player &&
          targeted.unit == null &&
          selected.unit.moves >= distance(selected, targeted) &&
          selected.online.includes(player) &&
          player.movedUnits < gameState.playerMoves
        ) {
          console.log("move");
          gameMatrix[targeted.i][targeted.j] = new Situation(targeted.i, targeted.j, targeted.feature, selected.unit, player);
          gameMatrix[selected.i][selected.j] = new Situation(selected.i, selected.j, selected.feature);
          if (selected.unit.moves == selected.unit.initialMoves) {
            player.movedUnits++
          };
          gameMatrix[targeted.i][targeted.j].unit.moves -= distance(selected, targeted);
          resetClicked();
        } else if ( // attack
          gameState.battle &&
          selected.player == player &&
          targeted.player == enemy &&
          targeted.unit != null &&
          selected.unit.moves >= distance(selected, targeted) &&
          targeted.aggregateDefense - targeted.aggregateAttack < 0 &&
          selected.online.includes(player) &&
          player.attackedUnits < gameState.playerAttacks
        ) {
          console.log("attack");
          if (
            (targeted.aggregateDefense - targeted.aggregateAttack <= 2) ||
            validRetreat(targeted) == false
          ) {
            gameMatrix[targeted.i][targeted.j] = new Situation(targeted.i, targeted.j, targeted.feature, selected.unit, player);
            gameMatrix[selected.i][selected.j] = new Situation(selected.i, selected.j, selected.feature);
          } else {
            targeted.unit.retreat = true;
            targeted.unit.attack = 0;
          };
          player.attackedUnits++;
          resetClicked();
        } else if ( // place
          gameState.battle == false &&
          (player.turn ? targeted.i >= rows / 2 : targeted.i < rows / 2) &&
          targeted.unit == null
        ) {
          console.log("place")
          if (
            selected == arsenal &&
            targeted.feature == empty
          ) {
            gameMatrix[targeted.i][targeted.j] = new Situation(targeted.i, targeted.j, arsenal, null, player);
            player.placedUnits++;
          } else if (
            selected != arsenal &&
            targeted.feature.traversable
          ) {
            gameMatrix[targeted.i][targeted.j] = new Situation(targeted.i, targeted.j, targeted.feature, {...selected}, player);
            player.placedUnits++;
          };
          if (player.placedUnits == gameState.playerUnits.length) {
            nextTurn();
          };
          if (
            player.placedUnits == gameState.playerUnits.length &&
            enemy.placedUnits == gameState.playerUnits.length
          ) {
            gameState.battle = !gameState.battle;
            resetClicked();
          };
        } else {
          resetClicked();
        };
      };
    };
  
    radiateComms(a);
    radiateComms(b);
    adjecentComms(a);
    adjecentComms(b);
    aggregateStats();
  
    // iterate through matrix, refresh board
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // calls cell objects draw method, draws the board
        let cell = gameMatrix[i][j];
        cell.draw();
      };
    };
  
    // draws gameState info
    gameState.alert = "Player " + gameState.playerOnTurn.name + " turn.";
    if (gameState.battle) {
      gameState.alert += " Battle mode. Player moves: " + (gameState.playerMoves - gameState.playerOnTurn.movedUnits) + "/" + gameState.playerMoves + "." +
        " Player attacks: " + (gameState.playerAttacks - gameState.playerOnTurn.attackedUnits) + "/" + gameState.playerAttacks + ".";
      if (gameState.selectedSquare != null) {
        gameState.alert += " Selected square: " + gameState.selectedSquare.info + "."
      };
    };
    if (gameState.battle == false) {
      gameState.alert = gameState.alert + " Placement mode. Unit to place: " + gameState.playerUnits[gameState.playerOnTurn.placedUnits].name + ".";
    };
    currentInfo.plain(gameState.alert)
    /*if (gameState.battle == false) {
      let player = gameState.playerOnTurn;
      let unit = playerUnits[gameState.playerOnTurn.placedUnits];
      let alert = "Player " + player.name + " place your " + unit.name;
      metaLayer.text(alert).center(width / 2, (height / 2) - (side / 2)).attr({class: "alert " + player.name})
    };*/
    
  
    // flipper
    if (gameState.lastTurn != gameState.turn) {
      board.rotate(180);
      gameState.lastTurn = gameState.turn;
    };
  }
  gameLoop()
  
  // battle

  const matrix = [
    /*    0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24*/
    /*A*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*B*/[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*C*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*D*/[0, 0, 0, 0, 0, 0, 0, 5, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*E*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*F*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*G*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*H*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    /*I*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*J*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*K*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*L*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*M*/[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*N*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*O*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    /*P*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*Q*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*R*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*S*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /*T*/[0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
    ];
    /*
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
    ));*/