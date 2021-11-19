import { purgeExpiredStatuses } from "@adventure-bot/statusEffects/purgeExpiredStatuses";

import store, { ReduxState } from "@adventure-bot/store";

import { createSelector } from "@reduxjs/toolkit";
import { Character } from "@adventure-bot/character/Character";
import { getMonsterById } from "@adventure-bot/store/selectors";

const getCharacterById = createSelector(
  (state: ReduxState, characterId: string) =>
    state.characters.charactersById[characterId],
  (char) => char
);

export const getCharacter = (characterId: string): Character | void => {
  purgeExpiredStatuses(characterId);
  const state = store.getState();
  const character = getCharacterById(state, characterId);
  return character ?? getMonsterById(state, characterId);
};
