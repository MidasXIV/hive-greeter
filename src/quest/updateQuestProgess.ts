import { User } from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter, updateCharacter } from "../gameState";
import { addQuestProgress } from "./addQuestProgress";
import { QuestId } from "./quests";

export const updateQuestProgess = (
  user: User,
  questId: QuestId,
  change: number
): Character | void =>
  updateCharacter(addQuestProgress(getUserCharacter(user), questId, change));
