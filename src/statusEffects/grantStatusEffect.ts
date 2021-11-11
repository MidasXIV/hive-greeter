import { Character } from "../character/Character";
import { StatusEffect } from "./StatusEffect";
import { getCharacter, updateCharacter } from "../gameState";

export const updateStatusEffect = (
  characterId: string,
  effect: StatusEffect
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    statusEffects: [...(character.statusEffects || []), effect],
  });
  return getCharacter(characterId);
};

export const grantStatusEffect = (
  character: Character,
  effect: StatusEffect
): Character => ({
  ...character,
  statusEffects: [...(character.statusEffects || []), effect],
});

export const hasStatusEffect = (character: Character, name: string): boolean =>
  Boolean(character.statusEffects?.find((effect) => effect.name === name));
