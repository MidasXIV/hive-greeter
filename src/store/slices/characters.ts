import { Character } from "../../character/Character";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
    }
  },
})

export const {
  updateCharacter,
} = characterSlice.actions

export default characterSlice.reducer