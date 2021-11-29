import { APIEmbedField } from "discord-api-types";
import { CommandInteraction } from "discord.js";
import { Character } from "../character/Character";
import { Stat, statTitles } from "../character/Stats";
import { statText } from "./statText";

export function statField(
  character: Character,
  interaction: CommandInteraction,
  stat: Stat
): APIEmbedField {
  return {
    name: statTitles[stat],
    value: statText({ character, stat, interaction }),
    inline: true,
  };
}
