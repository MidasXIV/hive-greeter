import { defaultCooldowns } from "@adventure-bot/character/defaultCooldowns";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const cooldownsSlice = createSlice({
  name: 'cooldowns',
  initialState: {
    ...defaultCooldowns,
  },
  reducers: {
    updateCooldowns(state, action: PayloadAction<typeof defaultCooldowns>) {
      const cooldowns = action.payload
      state = {
        ...state,
        ...cooldowns,
      }
    },
  },
})

export const {
  updateCooldowns,
} = cooldownsSlice.actions

export default cooldownsSlice.reducer