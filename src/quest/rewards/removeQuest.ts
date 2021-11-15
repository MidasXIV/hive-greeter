import { User } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { updateCharacter } from "../../character/updateCharacter";
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
