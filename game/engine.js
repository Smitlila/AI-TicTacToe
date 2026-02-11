// game/engine.js
export const EMPTY = null;

export function createBoard() {
  return Array(9).fill(EMPTY);
}

export function isValidMove(board, idx) {
  return Number.isInteger(idx) && idx >= 0 && idx < 9 && board[idx] === EMPTY;
}

export function applyMove(board, idx, player) {
  const next = board.slice();
  next[idx] = player; // "X" or "O"
  return next;
}

export function availableMoves(board) {
  const moves = [];
  for (let i = 0; i < 9; i++) if (board[i] === EMPTY) moves.push(i);
  return moves;
}

export function lines() {
  return [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
}

export function getWinner(board) {
  for (const [a,b,c] of lines()) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export function isDraw(board) {
  return getWinner(board) === null && board.every(x => x !== EMPTY);
}

export function isTerminal(board) {
  return getWinner(board) !== null || isDraw(board);
}
