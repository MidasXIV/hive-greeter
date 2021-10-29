import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { attack, getHP } from "../db";

// todo: https://discordjs.guide/interactions/registering-slash-commands.html#subcommands
// use addUserOption to specify target

export const command = new SlashCommandBuilder()
  .setName("attack")
  .setDescription("Make an attack")
  .addSubcommand((subCommand) =>
    subCommand
      .setName("target")
      .setDescription("Whom do you wish to attack?")
      .addUserOption((option) =>
        option.setName("target").setDescription("Whom to attack")
      )
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const defender = interaction.options.data[0].options?.[0].user;
  const attacker = interaction.member.user;
  if (!defender) {
    await interaction.reply(`You must specify a target @player`);
    return;
  }

  const result = attack(attacker.id, defender.id);
  switch (result.outcome) {
    case "hit":
      await interaction.reply(
        `You hit ${defender.username} for ${result.damage}! ${
          defender.username
        } is now at ${getHP(defender.id)}.`
      );
      if (getHP(defender.id) <= 0) {
        await interaction.reply(`${defender.username} is unconcious!`);
      }
      break;
    case "miss":
      await interaction.reply(
        `Miss! ${defender.username} is still at ${getHP(defender.id)}.`
      );
      break;
    case "cooldown":
      await interaction.reply(`You can't do that yet.`);
      break;
  }
};

export default { command, execute };
