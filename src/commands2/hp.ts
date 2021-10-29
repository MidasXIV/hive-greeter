import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getHP } from "../db";

export const command = new SlashCommandBuilder()
  .setName("hp")
  .setDescription("Check your health or someone else's.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const initiator = interaction.member.user;
  const target = interaction.options.data[0]?.user;
  if (!target) {
    await interaction.reply(`You have ${getHP(initiator.id)} health.`);
    return;
  }
  await interaction.reply(`${target.username} has ${getHP(target.id)} health.`);
};

export default { command, execute };
