import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { buffQuestReward } from "./buffQuestReward";

export const survivorBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const quest = character.quests.survivor;
  if (!quest) return;
  buffQuestReward(
    interaction,
    {
      name: "Survivor",
      buff: true,
      debuff: false,
      duration: 4 * 60 * 60000,
      modifiers: {
        maxHP: 5,
      },
      started: new Date().toString(),
    },
    quest
  );
};
