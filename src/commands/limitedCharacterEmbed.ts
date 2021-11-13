import { MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { primaryStatFields } from "./inspect";

export const limitedCharacterEmbed = (character: Character): MessageEmbed =>
  new MessageEmbed()
    .setTitle(character.name)
    .setThumbnail(character.profile)
    .addFields(primaryStatFields(character));
