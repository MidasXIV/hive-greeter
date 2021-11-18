import { AttackResult } from "../attack/AttackResult";
import { Character } from "../character/Character";
import { hitChanceText } from "./hitChanceText";
import { accuracyBar } from "./accuracyBar";

export function accuracyText({
  attacker,
  defender,
  attacks,
}: {
  attacker: Character;
  defender: Character;
  attacks: AttackResult[];
}): string {
  return `Hit chance ${hitChanceText(attacker, defender)}
          ${accuracyBar(attacks)}`;
}
