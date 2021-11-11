import { User } from "discord.js";
import { getUserCharacter } from "../gameState";
import { Quest } from "./Quest";
import { QuestId } from "./quests";

export const isQuestComplete = (quest: Quest): boolean =>
  quest.progress >= quest.totalRequired;

export const isUserQuestComplete = (user: User, questId: QuestId): boolean => {
  const quest = getUserCharacter(user).quests[questId];
  return quest ? isQuestComplete(quest) : false;
};
