import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import {
  Character,
  getAcModifier,
  getModifiedAc,
  getUserCharacter,
} from "../db";
import { cooldownRemainingText } from "../utils";

export const command = new SlashCommandBuilder()
  .setName("inspect")
  .setDescription("Inspect someone.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user;
  const character = getUserCharacter(user);
  await interaction.reply({
    embeds: [characterEmbed(character)],
    fetchReply: true,
  });
};

export default { command, execute };

export const characterEmbed = (character: Character): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(character.name)
    .setImage(character.profile)
    .addFields([
      {
        name: "HP",
        value: `🩸 ${character.hp}/${character.maxHP}`,
        inline: true,
      },
      {
        name: "AC",
        value: `🛡 ${getModifiedAc(character)}${
          getAcModifier(character)
            ? ` (${character.ac}+${getAcModifier(character)})`
            : ``
        }`,
        inline: true,
      },
      {
        name: "Attack Bonus",
        value: `⚔ ${character.attackBonus}`,
        inline: true,
      },
      {
        name: "Attack Available",
        value: cooldownRemainingText(character.id, "attack"),
        inline: true,
      },
      {
        name: "Adventure Available",
        value: cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
      {
        name: "Heal Available",
        value: cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
      {
        name: "XP",
        value: character.xp.toString(),
        inline: true,
      },
    ]);
  character.statusEffects?.forEach((effect) =>
    embed.addField(
      effect.name,
      `Expires ${moment(new Date(effect.started))
        .add(effect.duration)
        .fromNow()}`,
      true
    )
  );
  return embed;
};
