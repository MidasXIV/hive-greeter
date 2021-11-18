import { Character } from "@adventure-bot/character/Character";
import { d20 } from "@adventure-bot/gameState";
import { AttackResult } from "./AttackResult";
import { getCharacterStatModified } from "@adventure-bot/character/getCharacterStatModified";
import { updateCharacterQuestProgess } from "@adventure-bot/quest/updateQuestProgess";
import { adjustHP } from "@adventure-bot/character/adjustHP";
import { getCharacterUpdate } from "@adventure-bot/character/getCharacterUpdate";

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
