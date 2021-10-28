type Player = {
  id: string;
  hp: number;
};
type DB = {
  players: Map<string, Player>;
};
const db: DB = { players: new Map() };

export const getHP = (playerId: string): number => getPlayer(playerId).hp;

export const getPlayer = (playerId: string): Player => {
  console.log(`created ${playerId}`);
  const player = db.players.get(playerId);
  if (!player) {
    return createPlayer(playerId);
  }
  return player;
};

export const createPlayer = (playerId: string): Player => {
  const player = { id: playerId, hp: 10 };
  db.players.set(playerId, { id: playerId, hp: 10 });
  return player;
};

export const damage = (playerId: string, amount: number): Player => {
  const player = getPlayer(playerId);
  db.players.set(playerId, {
    ...player,
    hp: player.hp - amount,
  });
  return getPlayer(playerId);
};

export const attack = (attackerId: string, defenderId: string): boolean => {
  if (Math.random() > 0.5) {
    damage(defenderId, 1);
    return true;
  }
  return false;
};
