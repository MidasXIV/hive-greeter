import { createSlice } from '@reduxjs/toolkit'

const initialState: {
  lastSave: string | undefined
} = {
  lastSave: undefined
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateLastSave(state) {
      state.lastSave = new Date().toString()
    }
  },
})

export const {
  updateLastSave,
} = gameSlice.actions

export default gameSlice.reducer