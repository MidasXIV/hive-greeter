import { Emoji, MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { statFields } from "../commands/inspect";
import { primaryStatFields } from "../commands/primaryStatFields";
import { decoratedName } from "./decoratedName";

export const characterEmbed = (
  character: Character,
  xpEmoji?: Emoji
): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(decoratedName(character))
    .setImage(character.profile)
    .addFields([
      ...primaryStatFields({ character, xpEmoji }),
      ...statFields(character),
    ]);
  return embed;
};
