import { Character } from "../character/Character";
import { StatusEffect } from "./StatusEffect";
import { getCharacter } from "../character/getCharacter";
import store from '@adventure-bot/store'
import { addCharacterStatusEffect } from '@adventure-bot/store/slices/characters'

export const updateStatusEffect = (
  characterId: string,
  effect: StatusEffect
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  store.dispatch(addCharacterStatusEffect({
    character,
    effect,
  }))
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
