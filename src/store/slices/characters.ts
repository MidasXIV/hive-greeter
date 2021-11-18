import { Character } from "@adventure-bot/character/Character";
import { StatusEffect } from "@adventure-bot/statusEffects/StatusEffect";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { QuestId } from "@adventure-bot/quest/quests";
// import { updateCharacter } from 'character/updateCharacter';

export const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  Date.now() > new Date(effect.started).valueOf() + effect.duration;

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

    addCharacterStatusEffect(state, action: PayloadAction<{
      character: Character,
      effect: StatusEffect
    }>) {
      const { character, effect } = action.payload
      state.charactersById[character.id] = {
        ...character,
        statusEffects: [...(character.statusEffects || []), effect],
      }
    },

    purgeExpiredStatuses(state, action: PayloadAction<Character>) {
      const character = action.payload

      state.charactersById[character.id].statusEffects = 
        character.statusEffects?.filter(
          (effect) => !isStatusEffectExpired(effect)
        ) ?? []
    },

    addCharacterQuestProgress(state, action: PayloadAction<{
      character: Character,
      questId: QuestId,
      amount: number
    }>) {
      const { character, questId, amount } = action.payload
      const quest = character.quests[questId];
      
      if (quest) {
        state.charactersById[character.id] = {
          ...character,
          quests: {
            ...character.quests,
            [questId]: {
              ...quest,
              progress: quest.progress + amount,
            },
          },
        }
      }

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
  addCharacterStatusEffect,
  addCharacterQuestProgress,
} = characterSlice.actions

export default characterSlice.reducer