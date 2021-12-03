import { Character } from "../../character/Character";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestId } from "../../quest/quests";
import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { Item } from "equipment/Item";
import { equipmentFilter, LootResult } from "../../character/loot/loot";
import { Monster } from "../../monster/Monster";

export const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  Date.now() > new Date(effect.started).valueOf() + effect.duration;

const charactersById: Record<string, Character> = {};
const roamingMonsters: string[] = [];

const characterSlice = createSlice({
  name: "characters",
  initialState: {
    charactersById,
    roamingMonsters,
    isHeavyCrownInPlay: false,
  },
  reducers: {
    updateCharacter(state, action: PayloadAction<Character>) {
      const character = action.payload;
      state.charactersById[character.id] = character;
    },

    monsterCreated(state, action: PayloadAction<Monster>) {
      const monster = action.payload;
      state.charactersById[monster.id] = monster;
      state.roamingMonsters.push(monster.id);
    },

    characterLooted(state, action: PayloadAction<LootResult>) {
      const { targetId, looterId, itemsTaken, goldTaken } = action.payload;
      const looter = state.charactersById[looterId];
      looter.gold += goldTaken;
      looter.inventory = [...looter.inventory, ...itemsTaken];

      const target = state.charactersById[targetId];
      const isTakenItem = (item: Item) =>
        itemsTaken.find((i) => i.id === item.id);
      target.inventory = target.inventory.filter((item) => !isTakenItem(item));
      target.equipment = equipmentFilter(
        target.equipment,
        (item) => !isTakenItem(item)
      );
    },

    updateCharacterCooldowns(
      state,
      action: PayloadAction<{
        character: Character;
        cooldowns: Character["cooldowns"];
      }>
    ) {
      const { character, cooldowns } = action.payload;
      state.charactersById[character.id] = {
        ...character,
        cooldowns,
      };
    },

    addCharacterStatusEffect(
      state,
      action: PayloadAction<{
        character: Character;
        effect: StatusEffect;
      }>
    ) {
      const { character, effect } = action.payload;
      state.charactersById[character.id] = {
        ...character,
        statusEffects: [...(character.statusEffects || []), effect],
      };
    },

    purgeExpiredStatuses(state, action: PayloadAction<Character>) {
      const character = action.payload;

      state.charactersById[character.id].statusEffects =
        character.statusEffects?.filter(
          (effect) => !isStatusEffectExpired(effect)
        ) ?? [];
    },

    addCharacterQuestProgress(
      state,
      action: PayloadAction<{
        character: Character;
        questId: QuestId;
        amount: number;
      }>
    ) {
      const { character, questId, amount } = action.payload;
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
        };
      }
    },

    questCompleted(
      state,
      action: PayloadAction<{
        questId: QuestId;
        characterId: string;
      }>
    ) {
      const { questId, characterId } = action.payload;
      delete state.charactersById[characterId].quests[questId];
    },

    goldGained(
      state,
      action: PayloadAction<{
        characterId: string;
        amount: number;
      }>
    ) {
      const { characterId, amount } = action.payload;
      state.charactersById[characterId].gold += amount;
    },

    updateGold(
      state,
      action: PayloadAction<{
        characterId: string;
        gold: number;
      }>
    ) {
      const { characterId, gold } = action.payload;
      state.charactersById[characterId].gold = gold;
    },

    grantDivineBlessing(state, action: PayloadAction<Character>) {
      const character = action.payload;
      state.charactersById[character.id] = {
        ...character,
        maxHP: character.maxHP + 1,
        hp: character.hp + 1,
      };
    },

    adjustCharacterHP(
      state,
      action: PayloadAction<{
        character: Character;
        amount: number;
      }>
    ) {
      const { character, amount } = action.payload;
      const maxHP = getCharacterStatModified(character, "maxHP");
      let newHp = character.hp + amount;
      if (newHp < 0) newHp = 0;
      if (newHp > maxHP) newHp = maxHP;

      state.charactersById[character.id] = {
        ...character,
        hp: newHp,
      };
    },

    addItemToInventory(
      state,
      action: PayloadAction<{
        character: Character;
        item: Item;
      }>
    ) {
      const { character, item } = action.payload;
      if (item.name === "heavy crown") {
        state.isHeavyCrownInPlay = true;
      }
      state.charactersById[character.id] = {
        ...character,
        inventory: [...character.inventory, item],
      };
    },
  },
});

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
  questCompleted,
  goldGained,
  characterLooted,
  monsterCreated,
} = characterSlice.actions;

export default characterSlice.reducer;
