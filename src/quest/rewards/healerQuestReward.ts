import { CommandInteraction, MessageEmbed } from "discord.js";
import inspect from "../../commands/inspect";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";
import { removeQuest } from "./removeQuest";

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const embeds = [
    new MessageEmbed({
      title: `Healer Quest Complete!`,
      description: "Your prowess is unmatched!",
    }),
  ];
  updateStatusEffect(interaction.user.id, {
    name: "Healer",
    buff: true,
    debuff: false,
    duration: 4 * 60 * 60000,
    modifiers: {},
    started: new Date().toString(),
  });

  removeQuest({ user: interaction.user, questId: "healer" });

  await interaction.followUp({
    embeds,
  });
  await inspect.execute(interaction, "followUp");
};
