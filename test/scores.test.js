import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const originalCwd = process.cwd();
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tictactoe-scores-"));
let scores;

before(async () => {
  process.chdir(tmpDir);
  scores = await import("../game/scores.js");
});

after(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test("getScore returns zeroed defaults for new player", () => {
  const score = scores.getScore("player1");
  assert.deepEqual(score, { wins: 0, losses: 0, draws: 0, games: 0 });
});

test("recordResult updates totals and persists", () => {
  scores.recordResult("player1", "win");
  scores.recordResult("player1", "loss");
  scores.recordResult("player1", "draw");

  const score = scores.getScore("player1");
  assert.deepEqual(score, { wins: 1, losses: 1, draws: 1, games: 3 });
});

test("resetScore clears existing stats", () => {
  scores.recordResult("player2", "win");
  const reset = scores.resetScore("player2");
  assert.deepEqual(reset, { wins: 0, losses: 0, draws: 0, games: 0 });
});

