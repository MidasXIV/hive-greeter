import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { randomUUID } from "crypto";

import { Encounter } from "@adventure-bot/monster/Encounter";
import { Monster } from "@adventure-bot/monster/Monster";
import { Character } from "@adventure-bot/character/Character";

const encountersById: Record<string, Encounter> = {}

const encountersSlice = createSlice({
  name: 'encounters',
  initialState: {
    encountersById,
  },
  reducers: {
    createEncounter(state, action: PayloadAction<{
      player: Character,
      monster: Monster,
    }>) {
      const { monster, player } = action.payload
      const encounter: Encounter = {
        id: randomUUID(),
        characterId: player.id,
        monsterId: monster.id,
        date: new Date().toString(),
        playerAttacks: [],
        monsterAttacks: [],
        rounds: 1,
        goldLooted: 0,
        outcome: "in progress",
      }
      state.encountersById[encounter.id] = {
        ...encounter,
      }
    },
    updateEncounter(state, action: PayloadAction<Encounter>) {
      const encounter = action.payload
      state.encountersById[encounter.id] = {
        ...encounter,
      }
    },
  },
})

export const {
  createEncounter,
  updateEncounter,
} = encountersSlice.actions

export default encountersSlice.reducer