import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter, getUserCharacters } from "../gameState";
import { primaryStatFields, statFields } from "./inspect";

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
      .slice(0, 10)
      .map(limitedCharacterEmbed),
  });
};

export default { command, execute };

export const limitedCharacterEmbed = (character: Character): MessageEmbed =>
  new MessageEmbed()
    .setTitle(character.name)
    .setThumbnail(character.profile)
    .addFields([...primaryStatFields(character), ...statFields(character)]);
