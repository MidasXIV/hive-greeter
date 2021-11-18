import { purgeExpiredStatuses } from "@adventure-bot/statusEffects/purgeExpiredStatuses";
import store, { ReduxState } from '@adventure-bot/store'

import { createSelector } from '@reduxjs/toolkit'
import { Character } from "@adventure-bot/character/Character";


const getCharacterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (char) => char
)

const getMonsterById = createSelector(
  (state: ReduxState, id: string) => state.monsters.monstersById[id],
  (monst) => monst
)

export const getCharacter = (id: string): Character | void => {
  purgeExpiredStatuses(id);
  const state = store.getState()
  const character = getCharacterById(state, id)
  return character ?? getMonsterById(state, id);
};
