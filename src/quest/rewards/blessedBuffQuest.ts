import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../getUserCharacter";
import { buffQuestReward } from "./buffQuestReward";

export const blessedBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const quest = character.quests.blessed;
  if (!quest) return;
  buffQuestReward(
    interaction,
    {
      name: "Blessed",
      buff: true,
      debuff: false,
      duration: 4 * 60 * 60000,
      modifiers: {},
      started: new Date().toString(),
    },
    quest
  );
};
