import { User } from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter } from "../character/getUserCharacter";
import { updateCharacter } from "../character/updateCharacter";
import { addQuestProgress } from "./addQuestProgress";
import { QuestId } from "./quests";

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
): Character | void =>
  updateCharacter(addQuestProgress(character.id, questId, change));
