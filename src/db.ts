type Player = {
  id: string;
  hp: number;
  maxHP: number;
  ac: number;
  lastAction?: Date;
  level: number;
};
type DB = {
  players: Map<string, Player>;
};
const db: DB = { players: new Map() };

export const getHP = (playerId: string): number => getPlayer(playerId).hp;

export const levelup = (playerId: string): void => {
  const player = getPlayer(playerId);
  db.players.set(playerId, {
    ...player,
    maxHP: player.maxHP + 1,
    hp: player.hp + 1,
  });
};

export const getPlayer = (playerId: string): Player => {
  const player = db.players.get(playerId);
  if (!player) {
    return createPlayer(playerId);
  }
  return player;
};

export const setCooldown = (playerId: string): Player => {
  const player = getPlayer(playerId);
  db.players.set(playerId, { ...player, lastAction: new Date() });
  return player;
};

export const createPlayer = (playerId: string): Player => {
  const player = { id: playerId, hp: 10, ac: 10, maxHP: 10, level: 1 };
  db.players.set(playerId, player);
  console.log(`created ${playerId}`);
  return player;
};

export const adjustHP = (playerId: string, amount: number): Player => {
  const player = getPlayer(playerId);

  let newHp = player.hp + amount;
  if (newHp < 0) newHp = 0;
  if (newHp > player.maxHP) newHp = player.maxHP;

  db.players.set(playerId, {
    ...player,
    hp: newHp,
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

export const attack = (initiatorId: string, targetId: string): AttackResult => {
  const attacker = getPlayer(initiatorId);
  if (isPlayerOnCooldown(initiatorId)) {
    return { outcome: "cooldown" };
  }
  db.players.set(initiatorId, { ...attacker, lastAction: new Date() });
  if (Math.random() > 0.5) {
    const damageAmount = Math.ceil(Math.random() * 6);
    adjustHP(targetId, -damageAmount);
    return { outcome: "hit", damage: damageAmount };
  }
  return { outcome: "miss" };
};

type TrapResult = { outcome: "hit"; damage: number } | { outcome: "miss" };

export const trap = (playerId: string): TrapResult => {
  if (Math.random() > 0.5) {
    const damageAmount = Math.ceil(Math.random() * 6);
    adjustHP(playerId, -damageAmount);
    return { outcome: "hit", damage: damageAmount };
  }
  return { outcome: "miss" };
};

type HealResult =
  | { outcome: "healed"; amount: number }
  | { outcome: "cooldown" };

export const heal = (initiatorId: string, targetId: string): HealResult => {
  const healer = getPlayer(initiatorId);
  if (isPlayerOnCooldown(initiatorId)) {
    return { outcome: "cooldown" };
  }
  db.players.set(initiatorId, { ...healer, lastAction: new Date() });
  const amount = Math.ceil(Math.random() * 6);
  adjustHP(targetId, amount);
  return { outcome: "healed", amount };
};
