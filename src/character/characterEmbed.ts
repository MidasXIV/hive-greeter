import { Emoji, MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { statFields } from "../commands/inspect";
import { primaryStatFields } from "../commands/primaryStatFields";

export const characterEmbed = (
  character: Character,
  xpEmoji?: Emoji
): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(character.name)
    .setImage(character.profile)
    .addFields([
      ...primaryStatFields({ character, xpEmoji }),
      ...statFields(character),
    ]);
  return embed;
};
