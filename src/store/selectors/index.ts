import { createSelector } from '@reduxjs/toolkit'
import { Character } from "@adventure-bot/character/Character";
// import { purgeExpiredStatuses } from "../purgeExpiredStatuses";
import store, { ReduxState } from '@adventure-bot/store'



export const getCharacterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (character) => character
)

export const getMonsterById = createSelector(
  (state: ReduxState, id: string) => state.monsters.monstersById[id],
  (monster) => monster
)

export const getAllEncounters = createSelector(
  (state: ReduxState) => state.encounters.encountersById,
  (encountersById) => encountersById
)

export const getEncounterById = createSelector(
  (state: ReduxState, id: string) => state.encounters.encountersById[id],
  (encounter) => encounter
)

export const getCooldownByType = createSelector(
  (state: ReduxState, cooldownType: keyof ReduxState['cooldowns']) => state.cooldowns[cooldownType],
  (cooldown) => cooldown
)

export const hasItemNameInInventory = createSelector(
  (state: ReduxState, character: Character, itemName: string) => state.characters.charactersById[character.id]?.inventory.some((item) => item.name === itemName),
  (hasItem) => hasItem
)

export const getLoot = createSelector(
  (state: ReduxState) => state.loots.lootsById,
  (loots) => Object.values(loots)
)
