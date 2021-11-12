import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter, heal } from "../gameState";
import { cooldownRemainingText } from "../utils";
import { hpBarField } from "./inspect";

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
  const initiator = interaction.user;
  if (!target) {
    await interaction.reply(`You must specify a target @player`);
    return;
  }

  // ensure characters exist
  // TODO: a better way?
  getUserCharacter(initiator);
  getUserCharacter(target);
  const result = heal(initiator.id, target.id);
  if (!result) return interaction.reply("No result. This should not happen.");
  switch (result.outcome) {
    case "cooldown":
      await interaction.reply(
        `You can heal again in ${cooldownRemainingText(initiator.id, "heal")}.`
      );
      break;
    case "healed":
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`Heal`)
            .setDescription(`Healed ${target} for ${result.amount}!`)
            .setImage("https://i.imgur.com/S32LDbM.png")
            .addFields([
              hpBarField(getUserCharacter(interaction.user), result.amount),
            ]),
        ],
      });
      break;
  }
};

export default { command, execute };
