import { CommandInteraction } from "discord.js";
import { Character } from "../character/Character";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { Stat } from "../character/Stats";
import { Emoji } from "../Emoji";

export function statText({
  character,
  stat,
  interaction,
}: {
  character: Character;
  stat: Stat;
  interaction: CommandInteraction;
}): string {
  const modified = getCharacterStatModified(character, stat);
  const modifier = getCharacterStatModifier(character, stat);
  const sign = modifier > 0 ? "+" : "";
  return (
    Emoji(interaction, stat) +
    ` ${modified}${modifier ? ` (${sign}${modifier})` : ""}`
  );
}
