import { Encounter } from "../../monster/Encounter";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const encountersById: Record<string, Encounter> = {}

const encountersSlice = createSlice({
  name: 'encounters',
  initialState: {
    encountersById,
  },
  reducers: {
    updateEncounter(state, action: PayloadAction<Encounter>) {
      const encounter = action.payload
      state.encountersById[encounter.id] = {
        ...encounter,
      }
    },
  },
})

export const {
  updateEncounter,
} = encountersSlice.actions

export default encountersSlice.reducer