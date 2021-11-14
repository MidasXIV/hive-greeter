import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { getUserCharacters } from "../../character/getUserCharacters";
import { limitedCharacterEmbed } from "../../character/limitedCharacterEmbed";

export function listCharacters(interaction: CommandInteraction): void {
  getUserCharacter(interaction.user); // ensure Character existence to prevent an empty list
  interaction.reply({
    embeds: getUserCharacters()
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)
      .map(limitedCharacterEmbed),
  });
}
