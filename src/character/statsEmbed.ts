import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { stats } from "./Stats";
import { statField } from "./statField";

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
