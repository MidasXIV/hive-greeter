import { MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { primaryStatFields } from "./primaryStatFields";
import { decoratedName } from "./decoratedName";

export const limitedCharacterEmbed = (
  character: Character,
  adjustment = 0
): MessageEmbed =>
  new MessageEmbed({
    title: decoratedName(character),
    fields: primaryStatFields({ character, adjustment }),
  }).setThumbnail(character.profile);
