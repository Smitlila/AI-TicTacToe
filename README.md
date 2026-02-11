# AI TicTacToe API & Web UI

Play TicTacToe against a minimax AI via a small Express API plus a built-in web UI.

## Quick start

```bash
npm install
npm start
# open http://localhost:3000
```

## Scripts

- `npm start` — run the API and web UI
- `npm test` — run logic tests (engine, AI, scores)

## API overview

- `GET /health` — simple uptime check
- `POST /game/new` — start a game  
  body: `{ playerId, difficulty, human, ai }`  
  returns board state; if human is `O`, AI opens automatically.
- `POST /game/move` — make a human move; AI replies in the same call  
  body: `{ playerId, board, move, difficulty, human, ai }`
- `GET /scores/:playerId` — get cumulative stats
- `POST /scores/:playerId/reset` — reset stats

Boards are flat arrays of length 9 with `"X"`, `"O"`, or `null`.

## Web UI

Served from `/public` and available at `http://localhost:3000`.  
Features: choose side, difficulty, track scores, AI auto-plays when human is `O`.

## Tech

- Node + Express (ESM)
- Minimax AI with difficulty modes
- Persistent scores via `scores.json`

## Tests

Uses built-in `node:test`. Run `npm test`.