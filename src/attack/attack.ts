import { Character } from "../character/Character";
import { d20 } from "../gameState";
import { getCharacter } from "../character/getCharacter";
import { AttackResult } from "./AttackResult";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { updateCharacterQuestProgess } from "../quest/updateQuestProgess";
import { adjustHP } from "../character/adjustHP";

// TODO: decouple attack calculations from state side effects
export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult | void => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender) return;

  const attackRoll = d20();
  const damageBonus = getCharacterStatModified(attacker, "damageBonus");
  const damageRoll = Math.ceil(
    Math.random() * getCharacterStatModified(attacker, "damageMax")
  );
  const monsterDamageRoll = defender.isMonster
    ? Math.ceil(
        Math.random() * getCharacterStatModified(attacker, "monsterDamageMax")
      )
    : 0;

  const damage = damageRoll + monsterDamageRoll + damageBonus;
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
      damageRoll,
      monsterDamageRoll,
      attacker: getCharacter(attacker.id) as Character,
      defender: getCharacter(defender.id) as Character,
    };
  }

  return {
    outcome: "miss",
    attackRoll,
    damage,
    damageRoll,
    monsterDamageRoll,
    attacker: getCharacter(attacker.id) as Character,
    defender: getCharacter(defender.id) as Character,
  };
};
