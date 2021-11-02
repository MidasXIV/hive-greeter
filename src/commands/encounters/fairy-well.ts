import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustHP } from "../../db";

export const fairyWell = async (
  interaction: CommandInteraction
): Promise<void> => {
  const healAmount = Math.floor(Math.random() * 6);
  adjustHP(interaction.user.id, healAmount);
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setDescription(
          `You drink from a fairy's well, it heals you for ${healAmount}!`
        )
        .setImage("https://imgur.com/bgq63v9.png"),
    ],
  });
};
