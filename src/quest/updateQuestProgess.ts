import { User } from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter } from "../character/getUserCharacter";
import { QuestId } from "./quests";
import store from '../store'
import { addCharacterQuestProgress } from '../store/slices/characters'
import { getCharacterById } from '../store/selectors';

export const updateUserQuestProgess = (
  user: User,
  questId: QuestId,
  change: number
): Character | void =>
  updateCharacterQuestProgess(getUserCharacter(user), questId, change);

export const updateCharacterQuestProgess = (
  character: Character,
  questId: QuestId,
  change: number
): Character | void => {
  store.dispatch(addCharacterQuestProgress({
    character,
    questId,
    amount: change,
  }))
  return getCharacterById(store.getState(), character.id)
}
