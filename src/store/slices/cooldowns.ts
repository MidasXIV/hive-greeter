import { defaultCooldowns } from "../../character/defaultCooldowns";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const cooldownsSlice = createSlice({
  name: 'cooldowns',
  initialState: {
    defaultCooldowns,
  },
  reducers: {
    updateDefaultCooldowns(state, action: PayloadAction<typeof defaultCooldowns>) {
      const cooldown = action.payload
      state.defaultCooldowns = cooldown
    },
  },
})

export const {
  updateDefaultCooldowns,
} = cooldownsSlice.actions

export default cooldownsSlice.reducer