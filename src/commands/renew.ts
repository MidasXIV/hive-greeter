import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { isCharacterOnCooldown } from "../character/isCharacterOnCooldown";
import { getUserCharacter } from "../character/getUserCharacter";
import { cooldownRemainingText } from "../utils";
import { hpBarField } from "../character/hpBar/hpBarField";
import { adjustHP } from "../character/adjustHP";

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
  let healAmount = 3;
  const tickRate = 1000;
  // const tickRate = 5 * 60000;
  const message = await interaction.reply({
    fetchReply: true,
    content: `${interaction.user} renews ${target} for ${healAmount}`,
    embeds: [
      new MessageEmbed({
        fields: [hpBarField(getUserCharacter(target), healAmount)],
        timestamp: new Date(new Date().valueOf() + tickRate),
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  const fields = [hpBarField(getUserCharacter(target), healAmount)];
  const embeds = [
    new MessageEmbed({
      fields: [hpBarField(getUserCharacter(target), healAmount)],
      timestamp: new Date(),
    }),
  ];
  const timer = setInterval(() => {
    console.log("renew timer", fields);
    embeds.push(
      new MessageEmbed({
        fields: [hpBarField(getUserCharacter(target), healAmount)],
        timestamp: new Date(),
      })
    );
    fields.push(hpBarField(getUserCharacter(target), healAmount));
    message.edit({
      content: `${interaction.user} renews ${target} for ${healAmount}`,
      embeds,
    });
    adjustHP(target.id, healAmount--);
    if (!healAmount) {
      clearTimeout(timer);
      message.reply("Renew finished.");
    }
  }, tickRate);
};

export default { command, execute };
