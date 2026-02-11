// server.js
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBoard, isValidMove, applyMove, getWinner, isDraw, isTerminal } from "./game/engine.js";
import { chooseAiMove } from "./game/ai.js";
import { getScore, recordResult, resetScore } from "./game/scores.js";

const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static web UI
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/game/new", (req, res) => {
  const { playerId = "guest", difficulty = "hard", human = "X", ai = "O" } = req.body ?? {};
  let board = createBoard();
  let next = "human";
  let winner = null;
  let draw = false;
  let terminal = false;

  // If human plays second, let AI open
  if (human === "O") {
    const aiMove = chooseAiMove(board, difficulty, ai, human);
    board = applyMove(board, aiMove, ai);
    winner = getWinner(board);
    draw = isDraw(board);
    terminal = winner !== null || draw;
    next = terminal ? null : "human";
  }

  return res.json({
    playerId,
    difficulty,
    human,
    ai,
    board,
    next,
    terminal,
    winner,
    draw,
    result: null,
    score: null
  });
});

app.post("/game/move", (req, res) => {
  const { playerId = "guest", board, move, difficulty = "hard", human = "X", ai = "O" } = req.body ?? {};

  // Basic validation
  if (!Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({ error: "Invalid board. Must be array length 9." });
  }
  if (isTerminal(board)) {
    return res.status(400).json({ error: "Game already ended.", board });
  }
  if (!isValidMove(board, move)) {
    return res.status(400).json({ error: "Invalid move.", board });
  }

  // Human move
  let nextBoard = applyMove(board, move, human);

  // Check end after human
  let winner = getWinner(nextBoard);
  let draw = isDraw(nextBoard);

  if (!winner && !draw) {
    // AI move
    const aiMove = chooseAiMove(nextBoard, difficulty, ai, human);
    nextBoard = applyMove(nextBoard, aiMove, ai);
  }

  winner = getWinner(nextBoard);
  draw = isDraw(nextBoard);
  const terminal = winner !== null || draw;

  let scoreUpdate = null;
  let result = null;

  if (terminal) {
    if (winner === human) result = "win";
    else if (winner === ai) result = "loss";
    else result = "draw";
    scoreUpdate = recordResult(playerId, result);
  }

  return res.json({
    playerId,
    difficulty,
    human,
    ai,
    board: nextBoard,
    terminal,
    winner,          // "X" | "O" | null
    draw,
    result,          // "win" | "loss" | "draw" | null
    score: scoreUpdate
  });
});

app.get("/scores/:playerId", (req, res) => {
  const { playerId } = req.params;
  return res.json({ playerId, score: getScore(playerId) });
});

app.post("/scores/:playerId/reset", (req, res) => {
  const { playerId } = req.params;
  return res.json({ playerId, score: resetScore(playerId) });
});

// Fallback to SPA / static index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI TicTacToe API running on http://localhost:${PORT}`));
