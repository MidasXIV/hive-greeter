type Player = {
  id: string;
  hp: number;
  ac: number;
};
type DB = {
  players: Map<string, Player>;
};
const db: DB = { players: new Map() };

export const getHP = (playerId: string): number => getPlayer(playerId).hp;

export const getPlayer = (playerId: string): Player => {
  const player = db.players.get(playerId);
  if (!player) {
    return createPlayer(playerId);
  }
  return player;
};

export const createPlayer = (playerId: string): Player => {
  const player = { id: playerId, hp: 10, ac: 10 };
  db.players.set(playerId, player);
  console.log(`created ${playerId}`);
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

type AttackResult = { hit: true; damage: number } | { hit: false };

export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult => {
  if (Math.random() > 0.5) {
    const damageAmount = Math.ceil(Math.random() * 6);
    damage(defenderId, damageAmount);
    return { hit: true, damage: damageAmount };
  }
  return { hit: false };
};
