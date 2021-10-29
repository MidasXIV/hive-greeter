import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { heal, getHP } from "../db";

export const command = new SlashCommandBuilder()
  .setName("heal")
  .setDescription("Heal someone")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to heal").setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const target = interaction.options.data[0].user;
  const initiator = interaction.member.user;
  if (!target) {
    await interaction.reply(`You must specify a target @player`);
    return;
  }

  const result = heal(initiator.id, target.id);
  switch (result.outcome) {
    case "cooldown":
      await interaction.reply(`You can't do that yet.`);
      break;
    case "healed":
      await interaction.reply(
        `${target.username} for ${result.amount}! ${
          target.username
        } is now at ${getHP(target.id)}.`
      );
      break;
  }
};

export default { command, execute };
