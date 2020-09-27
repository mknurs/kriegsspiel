/*
Board init
*/
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
// draw grid
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

function getClickedCell(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // convert to i and j
  const i = Math.floor(y / (rect.height / rows));
  const j = Math.floor(x / (rect.width / cols));
  return { i, j }
}
canvas.addEventListener('click', function(e) {
  getClickedCell(canvas, e)
})

const socket = io();
