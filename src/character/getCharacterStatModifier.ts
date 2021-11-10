import { Character } from "./Character";
import { getEquipmentStatModifier } from "./getEquipmentStatModifier";
import { getStatusEffectStatModifier } from "./getStatusEffectStatModifier";
import { Stat } from "./Stats";

export const getCharacterStatModifier = (
  character: Character,
  stat: Stat
): number =>
  getStatusEffectStatModifier(character, stat) +
  getEquipmentStatModifier(character, stat);
