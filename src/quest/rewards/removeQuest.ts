import { User } from "discord.js";
import { getUserCharacter, updateCharacter } from "../../gameState";
import { QuestId } from "../quests";

export function removeQuest({
  user,
  questId,
}: {
  user: User;
  questId: QuestId;
}): void {
  const character = getUserCharacter(user);
  delete character.quests[questId];
  updateCharacter(character);
}
