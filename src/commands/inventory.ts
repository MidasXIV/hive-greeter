import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../gameState";
import { itemEmbed } from "../utils/equipment";

export const command = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("View your inventory.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const player = getUserCharacter(interaction.user);
  if (!player.inventory.length) {
    await interaction.reply("Your inventory is empty.");
    return;
  }
  interaction.reply({
    embeds: player.inventory.map(itemEmbed),
  });
};

export default { command, execute };
