import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyMove,
  createBoard,
  getWinner,
  isDraw,
  isTerminal,
  isValidMove
} from "../game/engine.js";

test("createBoard returns 9 empty slots", () => {
  const board = createBoard();
  assert.equal(board.length, 9);
  assert(board.every(cell => cell === null));
});

test("isValidMove checks bounds and emptiness", () => {
  const board = createBoard();
  assert.equal(isValidMove(board, 0), true);
  assert.equal(isValidMove(board, 9), false);
  assert.equal(isValidMove(board, -1), false);

  const next = applyMove(board, 0, "X");
  assert.equal(isValidMove(next, 0), false);
});

test("applyMove is immutable and sets value", () => {
  const board = createBoard();
  const next = applyMove(board, 4, "O");
  assert.equal(board[4], null);
  assert.equal(next[4], "O");
});

test("getWinner detects rows, columns, diagonals", () => {
  assert.equal(getWinner(["X", "X", "X", null, null, null, null, null, null]), "X");
  assert.equal(getWinner([null, null, null, "O", "O", "O", null, null, null]), "O");
  assert.equal(getWinner(["X", null, null, "X", null, null, "X", null, null]), "X");
  assert.equal(getWinner(["O", null, null, null, "O", null, null, null, "O"]), "O");
  assert.equal(getWinner([null, null, null, null, null, null, null, null, null]), null);
});

test("isDraw is true only when full with no winner", () => {
  const drawBoard = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
  assert.equal(isDraw(drawBoard), true);
  assert.equal(isDraw(["X", "X", "X", "O", "O", null, null, null, null]), false);
});

test("isTerminal matches winner or draw", () => {
  assert.equal(isTerminal(["X", "X", "X", null, null, null, null, null, null]), true);
  assert.equal(isTerminal(["X", "O", "X", "X", "O", "O", "O", "X", "X"]), true);
  assert.equal(isTerminal(createBoard()), false);
});

