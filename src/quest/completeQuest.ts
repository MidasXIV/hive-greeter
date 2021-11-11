import { User } from "discord.js";
import { getUserCharacter, updateCharacter } from "../gameState";
import { isQuestComplete } from "./isQuestComplete";

export const purgeCompletedQuests = (user: User): void => {
  const character = getUserCharacter(user);
  character.quests = Object.values(character.quests)
    .filter(isQuestComplete)
    .reduce((quests, quest) => ({ ...quests, [quest.id]: quest }), {});
  updateCharacter(character);
};
