import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { stats } from "../character/Stats";
import { statField } from "../character/statField";

export function statsEmbed({
  character,
  interaction,
}: {
  character: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  return new MessageEmbed({
    title: `Stats`,
    fields: stats.map((stat) => statField(character, interaction, stat)),
  });
}
