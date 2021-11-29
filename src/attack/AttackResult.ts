import { Character } from "../character/Character";

type AttackHit = {
  outcome: "hit";
  attacker: Character;
  defender: Character;
  attackRoll: number;
  damage: number;
  monsterDamageRoll: number;
  damageRoll: number;
};
type AttackMiss = {
  outcome: "miss";
  attacker: Character;
  defender: Character;
  attackRoll: number;
  damage: number;
  monsterDamageRoll: number;
  damageRoll: number;
};
type AttackCooldown = { outcome: "cooldown" };
export type AttackResult = AttackHit | AttackMiss | AttackCooldown;
