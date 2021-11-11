import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { isCharacterOnCooldown } from "../character/isCharacterOnCooldown";
import { adjustHP, getUserCharacter } from "../gameState";
import { cooldownRemainingText } from "../utils";
import { hpBarField } from "./inspect";

export const command = new SlashCommandBuilder()
  .setName("renew")
  .setDescription("Heal someone over time.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to heal").setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  if (isCharacterOnCooldown(interaction.user.id, "renew")) {
    interaction.reply(`${cooldownRemainingText(interaction.user.id, "renew")}`);
    return;
  }
  const target = interaction.options.data[0].user;
  if (!target) {
    await interaction.reply(`You must specify a target @player`);
    return;
  }
  let heal = 6;
  const tickRate = 1000;
  // const tickRate = 5 * 60000;
  const message = await interaction.reply({
    fetchReply: true,
    embeds: [
      new MessageEmbed({
        title: `${interaction.user} renews ${target} for ${heal}`,
        fields: [hpBarField(getUserCharacter(target))],
        timestamp: new Date(new Date().valueOf() + tickRate),
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  const timer = setInterval(() => {
    message.edit({
      content: `${interaction.user} heals ${target} for ${heal}`,
      embeds: [
        new MessageEmbed({
          fields: [hpBarField(getUserCharacter(target))],
          timestamp: new Date(new Date().valueOf() + tickRate),
        }),
      ],
    });
    adjustHP(target.id, heal--);
    if (!heal) clearTimeout(timer);
  }, tickRate);
};

export default { command, execute };
