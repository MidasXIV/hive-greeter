import { Monster } from "../../monster/Monster";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const monstersById: Record<string, Monster> = {}

const monstersSlice = createSlice({
  name: 'monsters',
  initialState: {
    monstersById,
  },
  reducers: {
    updateMonster(state, action: PayloadAction<Monster>) {
      const monster = action.payload
      state.monstersById[monster.id] = {
        ...monster,
      }
    },
  },
})

export const {
  updateMonster,
} = monstersSlice.actions

export default monstersSlice.reducer