import { createSelector } from '@reduxjs/toolkit'
import { Character } from "@adventure-bot/character/Character";
// import { purgeExpiredStatuses } from "../purgeExpiredStatuses";
import store, { ReduxState } from '@adventure-bot/store'



export const getCharacterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (character) => character
)

export const getAllCharacters = createSelector(
  (state: ReduxState) => state.characters.charactersById,
  (charactersById) => Object.values(charactersById)
)

export const getMonsterById = createSelector(
  (state: ReduxState, id: string) => state.monsters.monstersById[id],
  (monster) => monster
)

export const getRoamingMonsters = createSelector(
  (state: ReduxState) => state.monsters.monstersById,
  (monstersById) => Object.values(monstersById).filter((monster) => monster.hp > 0)
)

export const getAllEncounters = createSelector(
  (state: ReduxState) => state.encounters.encountersById,
  (encountersById) => Object.values(encountersById)
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
