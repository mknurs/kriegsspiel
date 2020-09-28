const boardMatrix = Array(20).fill().map(() => Array(25).fill(null));
const rows = boardMatrix.length;
const cols = boardMatrix[0].length;
/*
Canvas
*/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const cell = {
  width: canvas.width / cols,
  height: canvas.height / rows,
};
/*
Drawing functions
*/
// TODO: reset stroke styles: ctx.strokeStyle ="#000"; ctx.lineWidth=1; ctx.setLineDash([]);
function drawUnitBase(i, j, color) {
  ctx.strokeStyle = color;
  ctx.strokeRect(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/12 * cell.height),
    cell.width * 5/6,
    cell.height * 3/6
  );
};
function drawRelay(i, j, color) {
  drawUnitBase(i, j, color);
  ctx.strokeStyle = color;
  ctx.moveTo(
    (j * cell.width) + (1/12 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.lineTo(
    (j * cell.width) + (11/12 * cell.width),
    (i * cell.height) + (3/6 * cell.height)
  );
  ctx.stroke();
};
function drawSwiftBase(i, j, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(
    (j * cell.width) + (2/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.moveTo(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height)
  );
  ctx.arc(
    (j * cell.width) + (3/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.moveTo(
    (j * cell.width) + (4/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height)
  )
  ctx.arc(
    (j * cell.width) + (4/6 * cell.width),
    (i * cell.height) + (4/6 * cell.height),
    cell.width * 1/24,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
};
//
/*
Board init
*/
class Board {
  constructor(rows = 20, cols = 25) {
    this.rows = rows;
    this.cols = cols;
    this.abstractMatrix = Array(rows).fill().map(() => Array(cols).fill(null));
    this.arsenalMatrix = Array(rows).fill().map(() => Array(cols).fill(null));
    this.unitMatrix = Array(rows).fill().map(() => Array(cols).fill(null));
  };
};
class UnitType {
  constructor(name, moves, range, attack, defense, draw, communication = false, charge = false) {
    this.name = name;
    this.moves = moves;
    this.range = range;
    this.attack = attack;
    this.defense = defense;
    this.draw = draw;
    this.communication = communication;
    this.charge = charge;
  };
};
/*
const relay = new UnitType("relay", 1, 0, 0, 1, drawRelay, true);
const swiftRelay = new UnitType("swift relay", 2, 0, 0, 1, drawSwiftRelay, true);
const infantry = new UnitType("infantry", 1, 2, 4, 6, drawInfantry);
const cavalry = new UnitType("cavalry", 2, 2, 4, 5, drawCavalry, false, true);
const cannon = new UnitType("cannon", 1, 3, 5, 8, drawCannon);
const swiftCannon = new UnitType("swift cannon", 2, 3, 5, 8, drawSwiftCannon);
*/
class Arsenal {
  constructor(player) {

  }
}
class Unit {
  constructor(type, player) {

  }
}
const board = new Board();



const drawSituation = () => {
  // draw grid
  const drawGrid = () => {
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    for (let i = 0; i < rows + 1; i++) {
      ctx.moveTo(0, cell.height * i);
      ctx.lineTo(canvas.width, cell.height * i);
    };
    for (let j = 0; j < cols + 1; j++) {
      ctx.moveTo(cell.width * j, 0);
      ctx.lineTo(cell.width * j, canvas.height);
    };
    ctx.stroke();
  };

  drawGrid();
};

drawSituation();

function getClickedCell(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // convert to i and j
  const i = Math.floor(y / (rect.height / rows));
  const j = Math.floor(x / (rect.width / cols));
  console.log({ i, j })
  // return { i, j }
  drawRelay(i, j, "red");
  drawSwiftBase(i, j, "blue")
}
canvas.addEventListener('click', function(e) {
  getClickedCell(canvas, e)
})

const socket = io();
