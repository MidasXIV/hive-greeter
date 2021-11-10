import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../../gameState";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";

export const survivorBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const embeds = [
    new MessageEmbed({
      title: `Survivor Quest Complete!`,
      description: "You have survived hardship and it only makes you harder.",
    }),
  ];
  updateStatusEffect(character.id, {
    name: "Survivor",
    buff: true,
    debuff: false,
    duration: 4 * 60 * 60000,
    modifiers: {
      maxHP: 5,
    },
    started: new Date().toString(),
  });
  await interaction.followUp({
    fetchReply: true,
    embeds,
  });
};
