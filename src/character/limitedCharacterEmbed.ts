import { MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { primaryStatFields } from "../commands/primaryStatFields";
import { decoratedName } from "./decoratedName";

export const limitedCharacterEmbed = (
  character: Character,
  adjustment = 0
): MessageEmbed =>
  new MessageEmbed()
    .setTitle(decoratedName(character))
    .setThumbnail(character.profile)
    .addFields(primaryStatFields({ character, adjustment }));
