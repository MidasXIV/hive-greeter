import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { buffQuestReward } from "./buffQuestReward";

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const quest = getUserCharacter(interaction.user).quests.healer;
  if (!quest) return;
  buffQuestReward(
    interaction,
    {
      name: "Healer",
      buff: true,
      debuff: false,
      duration: 24 * 60 * 60000,
      modifiers: {},
      started: new Date().toString(),
    },
    quest
  );
};
