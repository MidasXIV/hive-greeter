import { Character } from "../character/Character";
import { d20 } from "../gameState";
import { AttackResult } from "./AttackResult";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { updateCharacterQuestProgess } from "../quest/updateQuestProgess";
import { adjustHP } from "../character/adjustHP";
import { getCharacterUpdate } from "../character/getCharacterUpdate";

export const characterAttack = (
  attacker: Character,
  defender: Character
): AttackResult => {
  const attackRoll = d20();
  const damageMax = getCharacterStatModified(attacker, "damageMax");
  const damage = Math.ceil(Math.random() * damageMax);
  if (
    attackRoll + getCharacterStatModified(attacker, "attackBonus") >=
    getCharacterStatModified(defender, "ac")
  ) {
    adjustHP(defender.id, -damage);
    if (defender.hp - damage > 0)
      updateCharacterQuestProgess(defender, "survivor", damage);
    return {
      outcome: "hit",
      attackRoll,
      damage,
      attacker: getCharacterUpdate(attacker),
      defender: getCharacterUpdate(defender),
    };
  }

  return {
    outcome: "miss",
    attackRoll,
    damage,
    attacker: getCharacterUpdate(attacker),
    defender: getCharacterUpdate(defender),
  };
};
