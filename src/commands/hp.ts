import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getHP, getMaxHP } from "../db";

export const command = new SlashCommandBuilder()
  .setName("hp")
  .setDescription("Check your health or someone else's.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  new MessageEmbed()
    .setTitle("Orc")
    .setThumbnail("https://i.imgur.com/2cT3cLm.jpeg")
    .addFields([
      {
        name: "HP",
        value: `${getHP(interaction.user.id)}/${getMaxHP(interaction.user.id)}`,
      },
    ]);
};

export default { command, execute };
