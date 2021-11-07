import { Character } from "../character/Character";
import { StatusEffect } from "./StatusEffect";
import { getCharacter, gameState } from "../gameState";

export const grantStatusEffect = (
  characterId: string,
  effect: StatusEffect
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  const updatedCharacter = {
    ...character,
    statusEffects: [...(character.statusEffects || []), effect],
  };
  gameState.characters.set(characterId, updatedCharacter);
  return getCharacter(characterId);
};

export const grantStatusEffect2 = (
  character: Character,
  effect: StatusEffect
): Character => ({
  ...character,
  statusEffects: [...(character.statusEffects || []), effect],
});
