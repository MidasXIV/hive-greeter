import { CommandInteraction, MessageEmbed } from "discord.js";
import inspect from "../../commands/inspect/inspect";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";
import { removeQuest } from "./removeQuest";

export const slayerBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const embeds = [
    new MessageEmbed({
      title: `Slayer Quest Complete!`,
      description: "Your prowess is unmatched!",
    }),
  ];
  updateStatusEffect(interaction.user.id, {
    name: "Slayer",
    buff: true,
    debuff: false,
    duration: 4 * 60 * 60000,
    modifiers: {
      monsterDamageMax: 6,
    },
    started: new Date().toString(),
  });

  removeQuest({ user: interaction.user, questId: "slayer" });

  await interaction.followUp({
    embeds,
  });
  await inspect.execute(interaction);
};
