// game/ai.js
import { availableMoves, applyMove, getWinner, isDraw } from "./engine.js";

function scoreTerminal(board, aiPlayer, humanPlayer) {
  const w = getWinner(board);
  if (w === aiPlayer) return 10;
  if (w === humanPlayer) return -10;
  if (isDraw(board)) return 0;
  return null;
}

function minimax(board, depth, isMaximizing, aiPlayer, humanPlayer) {
  const terminalScore = scoreTerminal(board, aiPlayer, humanPlayer);
  if (terminalScore !== null) return terminalScore - Math.sign(terminalScore) * depth; // prefer faster wins, slower losses

  const moves = availableMoves(board);

  if (isMaximizing) {
    let best = -Infinity;
    for (const m of moves) {
      const next = applyMove(board, m, aiPlayer);
      best = Math.max(best, minimax(next, depth + 1, false, aiPlayer, humanPlayer));
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const next = applyMove(board, m, humanPlayer);
      best = Math.min(best, minimax(next, depth + 1, true, aiPlayer, humanPlayer));
    }
    return best;
  }
}

export function bestMove(board, aiPlayer = "O", humanPlayer = "X") {
  const moves = availableMoves(board);
  let bestScore = -Infinity;
  let best = moves[0];

  for (const m of moves) {
    const next = applyMove(board, m, aiPlayer);
    const s = minimax(next, 0, false, aiPlayer, humanPlayer);
    if (s > bestScore) {
      bestScore = s;
      best = m;
    }
  }
  return best;
}

function randomMove(board) {
  const moves = availableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * difficulty: "easy" | "medium" | "hard"
 */
export function chooseAiMove(board, difficulty = "hard", aiPlayer = "O", humanPlayer = "X") {
  if (availableMoves(board).length === 0) return null;

  if (difficulty === "easy") return randomMove(board);
  if (difficulty === "medium") {
    // 50/50: best vs random
    return Math.random() < 0.5 ? bestMove(board, aiPlayer, humanPlayer) : randomMove(board);
  }
  // hard (default)
  return bestMove(board, aiPlayer, humanPlayer);
}
