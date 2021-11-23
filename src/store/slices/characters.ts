import { Character } from "../../character/Character";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { QuestId } from "../../quest/quests";
import { getCharacterStatModified } from '../../character/getCharacterStatModified';

import { Item } from "../../equipment/equipment";

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

    grantDivineBlessing(state, action: PayloadAction<Character>) {
      const character = action.payload
      state.charactersById[character.id] = {
        ...character,
        maxHP: character.maxHP + 1,
        hp: character.hp + 1,
      }
    },

    adjustCharacterHP(state, action: PayloadAction<{
      character: Character
      amount: number
    }>) {
      const { character, amount } = action.payload
      const maxHP = getCharacterStatModified(character, "maxHP");
      let newHp = character.hp + amount;
      if (newHp < 0) newHp = 0;
      if (newHp > maxHP) newHp = maxHP;

      state.charactersById[character.id] = {
        ...character,
        hp: newHp,
      }
    },

    addItemToInventory(state, action: PayloadAction<{
      character: Character
      item: Item
    }>) {
      const { character, item } = action.payload
      state.charactersById[character.id] = {
        ...character,
        inventory: [...character.inventory, item],
      }
    }
  },
})

export const {
  updateCharacter,
  updateCharacterCooldowns,
  purgeExpiredStatuses,
  updateGold,
  addCharacterStatusEffect,
  addCharacterQuestProgress,
  grantDivineBlessing,
  adjustCharacterHP,
  addItemToInventory,
} = characterSlice.actions

export default characterSlice.reducer