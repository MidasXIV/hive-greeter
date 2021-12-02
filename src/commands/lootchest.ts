import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { chest } from "../encounters/chest";

export const command = new SlashCommandBuilder()
  .setName("lootchest")
  .setDescription("Loot a random chest.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await chest(interaction, {
    hasLock: false,
    hasTrap: false,
    isLocked: false,
    inspected: true,
    isLooted: false,
    isTrapped: false,
  });
};

export default { command, execute };
