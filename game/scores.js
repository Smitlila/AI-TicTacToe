// game/scores.js
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "scores.json");

function readAll() {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeAll(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
}

export function getScore(playerId) {
  const all = readAll();
  return all[playerId] ?? { wins: 0, losses: 0, draws: 0, games: 0 };
}

export function recordResult(playerId, result /* "win" | "loss" | "draw" */) {
  const all = readAll();
  const s = all[playerId] ?? { wins: 0, losses: 0, draws: 0, games: 0 };

  s.games += 1;
  if (result === "win") s.wins += 1;
  else if (result === "loss") s.losses += 1;
  else s.draws += 1;

  all[playerId] = s;
  writeAll(all);
  return s;
}

export function resetScore(playerId) {
  const all = readAll();
  all[playerId] = { wins: 0, losses: 0, draws: 0, games: 0 };
  writeAll(all);
  return all[playerId];
}
