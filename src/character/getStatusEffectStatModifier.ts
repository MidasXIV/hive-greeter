import { Character } from "./Character";
import { Stat } from "../gameState";

export const getStatusEffectStatModifier = (
  character: Character,
  stat: Stat
): number =>
  (character.statusEffects || []).reduce(
    (acc, effect) => acc + (effect.modifiers[stat] || 0),
    0
  );
