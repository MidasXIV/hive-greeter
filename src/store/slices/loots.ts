import { LootResult } from "../../character/loot/loot";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const lootsById: Record<string, LootResult> = {};

const lootsSlice = createSlice({
  name: "loots",
  initialState: {
    lootsById,
  },
  reducers: {
    looted(state, action: PayloadAction<LootResult>) {
      const loot = action.payload;
      state.lootsById[loot.id] = {
        ...loot,
      };
    },
  },
});

export const { looted } = lootsSlice.actions;

export default lootsSlice.reducer;
