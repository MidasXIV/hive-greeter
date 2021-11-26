import { EmbedFieldData, Emoji } from "discord.js";
import { Character } from "./Character";
import { getCharacterStatModified } from "./getCharacterStatModified";
import { hpBar } from "./hpBar/hpBar";

export function primaryStatFields({
  character,
  xpEmoji,
  adjustment = 0,
}: {
  character: Character;
  xpEmoji?: Emoji;
  adjustment?: number;
}): EmbedFieldData[] {
  return [
    {
      name: "HP",
      value: `${character.hp}/${getCharacterStatModified(
        character,
        "maxHP"
      )}\n${hpBar(character, adjustment)}`,
    },
    {
      name: "XP",
      value: (xpEmoji?.toString() ?? "🧠") + " " + character.xp.toString(), // TODO: refactor to use Emoji
      inline: true,
    },
    {
      name: "GP",
      value: "💰 " + character.gold.toString(),
      inline: true,
    },
  ];
}
