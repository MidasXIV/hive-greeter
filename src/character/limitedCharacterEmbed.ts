import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { primaryStatFields } from "./primaryStatFields";
import { decoratedName } from "./decoratedName";

export function limitedCharacterEmbed({
  character,
  interaction,
  adjustment = 0,
}: {
  character: Character;
  interaction: CommandInteraction;
  adjustment?: number;
}): MessageEmbed {
  return new MessageEmbed({
    title: decoratedName(character),
    fields: primaryStatFields({ character, adjustment, interaction }),
  }).setThumbnail(character.profile);
}
