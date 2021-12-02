import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { buffQuestReward } from "./buffQuestReward";

export const slayerBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const quest = character.quests.blessed;
  if (!quest) return;
  buffQuestReward(
    interaction,
    {
      name: "Slayer",
      buff: true,
      debuff: false,
      duration: 4 * 60 * 60000,
      modifiers: {
        monsterDamageMax: 6,
      },
      started: new Date().toString(),
    },
    quest
  );
};
