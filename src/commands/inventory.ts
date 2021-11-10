import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../gameState";
import { itemEmbed } from "../utils/equipment";

export const command = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("View your inventory.");

export const execute = async (
  interaction: CommandInteraction,
  responseType: "followUp" | "reply" = "reply"
): Promise<void> => {
  const player = getUserCharacter(interaction.user);
  if (!player.inventory.length) {
    await interaction[responseType]("Your inventory is empty.");
    return;
  }
  interaction[responseType]({
    embeds: player.inventory.map(itemEmbed),
  });
};

export default { command, execute };
