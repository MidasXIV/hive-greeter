import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { attack, getHP } from "../db";

export const command = new SlashCommandBuilder()
  .setName("attack")
  .setDescription("Make an attack")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to attack").setRequired(true)
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

  const result = attack(initiator.id, target.id);
  switch (result.outcome) {
    case "hit":
      await interaction.reply(
        `You hit ${target} for ${result.damage}! ${target} is now at ${getHP(
          target.id
        )}.`
      );
      if (getHP(target.id) <= 0) {
        await interaction.reply(`${target} is unconcious!`);
      }
      break;
    case "miss":
      await interaction.reply(
        `Miss! ${target} is still at ${getHP(target.id)}.`
      );
      break;
    case "cooldown":
      await interaction.reply(`You can't do that yet.`);
      break;
  }
};

export default { command, execute };
