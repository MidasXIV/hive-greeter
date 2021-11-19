import { purgeExpiredStatuses } from "@adventure-bot/statusEffects/purgeExpiredStatuses";
import { Character } from "@adventure-bot/character/Character";
import store from '@adventure-bot/store'
import { getCharacterById, getMonsterById } from "@adventure-bot/store/selectors";

export const getCharacter = (characterId: string): Character | void => {
  purgeExpiredStatuses(characterId);
  const state = store.getState();
  const character = getCharacterById(state, characterId);
  return character ?? getMonsterById(state, characterId);
};
