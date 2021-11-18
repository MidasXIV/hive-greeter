import { CommandInteraction, MessageEmbed } from "discord.js";
import { grantDivineBlessing } from "../grantDivineBlessing";

export const divineBlessing = async (
  interaction: CommandInteraction
): Promise<void> => {
  grantDivineBlessing(interaction.user.id);
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Divine Blessing")
        .setColor("GOLD")
        .setDescription(`A Divine blesses you with +1 max hp!`)
        .setImage("https://imgur.com/psnFPYG.png"),
    ],
  });
};
