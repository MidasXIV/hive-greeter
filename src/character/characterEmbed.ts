import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { primaryStatFields } from "./primaryStatFields";
import { decoratedName } from "./decoratedName";

export function characterEmbed({
  character,
  interaction,
}: {
  character: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  return new MessageEmbed()
    .setTitle(decoratedName(character))
    .setImage(character.profile)
    .addFields([...primaryStatFields({ character, interaction })]);
}
