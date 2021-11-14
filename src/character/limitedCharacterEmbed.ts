import { MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { primaryStatFields } from "../commands/inspect";

export const limitedCharacterEmbed = (character: Character): MessageEmbed =>
  new MessageEmbed()
    .setTitle(character.name)
    .setThumbnail(character.profile)
    .addFields(primaryStatFields(character));
