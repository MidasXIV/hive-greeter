import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character, getUserCharacters } from "../db";
import { cooldownRemainingText } from "../utils";

export const command = new SlashCommandBuilder()
  .setName("list")
  .setDescription("List something")
  .addSubcommand((option) =>
    option.setName("characters").setDescription("List all characters")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  interaction.reply({
    embeds: getUserCharacters()
      .sort((character) => character.xp)
      .map(characterEmbed),
  });
};

export default { command, execute };

export const characterEmbed = (character: Character): MessageEmbed =>
  new MessageEmbed()
    .setTitle(character.name)
    .setThumbnail(character.profile)
    .addFields([
      {
        name: "HP",
        value: `${character.hp}/${character.maxHP}`,
        inline: true,
      },
      {
        name: "AC",
        value: `${character.ac}`,
        inline: true,
      },
      {
        name: "Attack Bonus",
        value: `${character.attackBonus}`,
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
