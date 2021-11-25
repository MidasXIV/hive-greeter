import { Character } from "../character/Character";

type AttackHit = {
  outcome: "hit";
  attacker: Character;
  defender: Character;
  attackRoll: number;
  damage: number;
};
type AttackMiss = {
  outcome: "miss";
  attacker: Character;
  defender: Character;
  attackRoll: number;
  damage: number;
};
type AttackCooldown = { outcome: "cooldown" };
export type AttackResult = AttackHit | AttackMiss | AttackCooldown;