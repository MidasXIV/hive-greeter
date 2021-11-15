import { MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { primaryStatFields } from "../commands/inspect";

export const limitedCharacterEmbed = (
  character: Character,
  adjustment = 0
): MessageEmbed =>
  new MessageEmbed()
    .setTitle(character.name)
    .setThumbnail(character.profile)
    .addFields(primaryStatFields({ character, adjustment }));
