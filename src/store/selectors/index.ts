import { createSelector } from '@reduxjs/toolkit'
// import { Character } from "Character";
// import { purgeExpiredStatuses } from "../purgeExpiredStatuses";
import { ReduxState } from 'store'



export const getCharacterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (character) => character
)

export const getMonsterById = createSelector(
  (state: ReduxState, id: string) => state.monsters.monstersById[id],
  (monster) => monster
)

export const getEncounterById = createSelector(
  (state: ReduxState, id: string) => state.encounters.encountersById[id],
  (encounter) => encounter
)