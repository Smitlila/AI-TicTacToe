import { test } from "node:test";
import assert from "node:assert/strict";
import { bestMove, chooseAiMove } from "../game/ai.js";

test("bestMove chooses immediate win", () => {
  const board = ["O", "O", null, null, null, null, null, null, null];
  const move = bestMove(board, "O", "X");
  assert.equal(move, 2);
});

test("bestMove blocks opponent win", () => {
  const board = ["X", "X", null, null, "O", null, null, null, null];
  const move = bestMove(board, "O", "X");
  assert.equal(move, 2);
});

test("chooseAiMove respects difficulty settings", () => {
  const board = ["O", "O", null, null, null, null, null, null, null];
  const originalRandom = Math.random;

  try {
    Math.random = () => 0.9; // deterministic but > 0.5
    assert.equal(chooseAiMove(board, "hard", "O", "X"), 2);

    Math.random = () => 0.1; // medium chooses bestMove when < 0.5
    assert.equal(chooseAiMove(board, "medium", "O", "X"), 2);

    Math.random = () => 0.9; // medium chooses randomMove when >= 0.5
    const mediumRandom = chooseAiMove(board, "medium", "O", "X");
    assert([2, 3, 4, 5, 6, 7, 8].includes(mediumRandom));

    Math.random = () => 0; // deterministic random pick for easy
    const easyMove = chooseAiMove(board, "easy", "O", "X");
    assert.equal(easyMove, 2);
  } finally {
    Math.random = originalRandom;
  }
});

