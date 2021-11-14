import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { Character } from "../../character/Character";
import { chanceToHit } from "./chanceToHit";

export function hitChanceText(
  attacker: Character,
  defender: Character
): string {
  return (
    (
      100 *
      chanceToHit({
        bonus: getCharacterStatModified(attacker, "attackBonus"),
        dc: getCharacterStatModified(defender, "ac"),
      })
    ).toString() + "%"
  );
}
