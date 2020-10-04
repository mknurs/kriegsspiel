/*
Canvas
*/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

/*
Cell
*/
const cell = {
  width: canvas.width / board.cols,
  height: canvas.height / board.rows,
};