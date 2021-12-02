import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { actionEmbed } from "./inspect/actionEmbed";

export const command = new SlashCommandBuilder()
  .setName("cooldowns")
  .setDescription("Check your cooldowns.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  await interaction.editReply({
    embeds: [actionEmbed({ character, interaction })],
  });
};

export default { command, execute };
