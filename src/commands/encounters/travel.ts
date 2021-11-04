import { CommandInteraction, MessageEmbed } from "discord.js";
import { gainXP } from "../../db";

export const travel = async (
  interaction: CommandInteraction
): Promise<void> => {
  gainXP(interaction.user.id, 1);
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Travel")
        .setColor("GREEN")
        .setDescription(`You travel the lands.`)
        .addField("XP Gained", "1")
        .setImage("https://imgur.com/WCVVyh6.png"),
    ],
  });
};
