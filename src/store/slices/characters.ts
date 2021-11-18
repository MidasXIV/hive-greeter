import { Character } from "../../character/Character";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isStatusEffectExpired } from "../../isStatusEffectExpired";
// import { updateCharacter } from '../../character/updateCharacter';

const charactersById: Record<string, Character> = {}

const characterSlice = createSlice({
  name: 'characters',
  initialState: {
    charactersById,
  },
  reducers: {
    updateCharacter(state, action: PayloadAction<Character>) {
      const character = action.payload
      state.charactersById[character.id] = {
        ...character,
      }
    },

    updateCharacterCooldowns(state, action: PayloadAction<{
      character: Character,
      cooldowns: Character["cooldowns"]
    }>) {
      const { character, cooldowns } = action.payload
      state.charactersById[character.id] = {
        ...character,
        cooldowns,
      }
    },

    purgeExpiredStatuses(state, action: PayloadAction<Character>) {
      const character = action.payload

      state.charactersById[character.id].statusEffects = 
        character.statusEffects?.filter(
          (effect) => !isStatusEffectExpired(effect)
        ) ?? []
    },

    updateGold(state, action: PayloadAction<{
      character: Character,
      gold: number
    }>) {
      const { character, gold } = action.payload
      state.charactersById[character.id] = {
        ...character,
        gold,
      }
    },
  },
})

export const {
  updateCharacter,
  updateCharacterCooldowns,
  purgeExpiredStatuses,
  updateGold,
} = characterSlice.actions

export default characterSlice.reducer