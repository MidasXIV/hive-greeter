import { Character } from "./Character";
import { Stat } from "../gameState";
import { getEquipmentStatModifier } from "./getEquipmentStatModifier";
import { getStatusEffectStatModifier } from "./getStatusEffectStatModifier";

export const getCharacterStatModifier = (
  character: Character,
  stat: Stat
): number =>
  getStatusEffectStatModifier(character, stat) +
  getEquipmentStatModifier(character, stat);
