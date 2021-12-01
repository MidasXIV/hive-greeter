import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shrine } from "../../shrines/Shrine";

const byId: Record<string, Shrine> = {};

const shrinesSlice = createSlice({
  name: "shrines",
  initialState: {
    byId,
  },
  reducers: {
    addShrine(state, action: PayloadAction<Shrine>) {
      state.byId[action.payload.id] = action.payload;
    },
  },
});

export const { addShrine } = shrinesSlice.actions;

export default shrinesSlice.reducer;
