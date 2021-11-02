import { CommandInteraction, MessageEmbed } from "discord.js";

export const travel = async (
  interaction: CommandInteraction
): Promise<void> => {
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Travel")
        .setColor("GREEN")
        .setDescription(`You travel the lands.`)
        .setImage("https://imgur.com/WCVVyh6.png"),
    ],
  });
};
