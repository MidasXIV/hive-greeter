import { Character } from "../character/Character";
import { getCharacter, d20, adjustHP } from "../gameState";
import { AttackResult } from "./AttackResult";
import { getCharacterStatModified } from "../character/getCharacterStatModified";

export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult | void => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender) return;

  const attackRoll = d20();
  const damageMax = getCharacterStatModified(attacker, "damageMax");
  const damage = Math.ceil(Math.random() * damageMax);
  if (
    attackRoll + getCharacterStatModified(attacker, "attackBonus") >=
    getCharacterStatModified(defender, "ac")
  ) {
    adjustHP(defender.id, -damage);
    return {
      outcome: "hit",
      attackRoll,
      damage,
      attacker: getCharacter(attacker.id) as Character,
      defender: getCharacter(defender.id) as Character,
    };
  }

  return {
    outcome: "miss",
    attackRoll,
    damage,
    attacker: getCharacter(attacker.id) as Character,
    defender: getCharacter(defender.id) as Character,
  };
};
