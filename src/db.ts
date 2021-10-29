type Player = {
  id: string;
  hp: number;
  ac: number;
  lastAction?: Date;
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

const isPlayerOnCooldown = (playerId: string): boolean => {
  const cooldown = 60000;
  const player = getPlayer(playerId);
  return Boolean(
    player.lastAction && cooldown > Date.now() - player.lastAction.valueOf()
  );
};

type AttackResult =
  | { outcome: "hit"; damage: number }
  | { outcome: "miss" }
  | { outcome: "cooldown" };

export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult => {
  const attacker = getPlayer(attackerId);
  if (isPlayerOnCooldown(attackerId)) {
    return { outcome: "cooldown" };
  }
  db.players.set(attackerId, { ...attacker, lastAction: new Date() });
  if (Math.random() > 0.5) {
    const damageAmount = Math.ceil(Math.random() * 6);
    damage(defenderId, damageAmount);
    return { outcome: "hit", damage: damageAmount };
  }
  return { outcome: "miss" };
};
