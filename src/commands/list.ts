import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character, getUserCharacter, getUserCharacters } from "../db";
import { cooldownRemainingText } from "../utils";
import { hpBar } from "../utils/hp-bar";
import { statText } from "./inspect";

export const command = new SlashCommandBuilder()
  .setName("list")
  .setDescription("List something")
  .addSubcommand((option) =>
    option.setName("characters").setDescription("List all characters")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  // ensure character exists to prevent empty response error
  getUserCharacter(interaction.user);
  interaction.reply({
    embeds: getUserCharacters()
      .sort((a, b) => b.xp - a.xp)
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
        value: `${character.hp}/${character.maxHP}\n${hpBar(character)}`,
      },
      {
        name: "AC",
        value: `🛡 ${statText(character, "ac")}`,
        inline: true,
      },
      {
        name: "Attack",
        value: `⚔ ${statText(character, "attackBonus")}`,
        inline: true,
      },
      {
        name: "XP",
        value: character.xp.toString(),
        inline: true,
      },
      {
        name: "GP",
        value: character.gold.toString(),
        inline: true,
      },
      {
        name: "Attack Available",
        value: cooldownRemainingText(character.id, "attack"),
      },
      {
        name: "Adventure Available",
        value: cooldownRemainingText(character.id, "adventure"),
      },
      {
        name: "Heal Available",
        value: cooldownRemainingText(character.id, "adventure"),
      },
    ]);
