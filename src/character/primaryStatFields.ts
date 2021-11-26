import { CommandInteraction, EmbedFieldData } from "discord.js";
import { Emoji } from "../Emoji";
import { Character } from "./Character";
import { getCharacterStatModified } from "./getCharacterStatModified";
import { hpBar } from "./hpBar/hpBar";

export function primaryStatFields({
  character,
  adjustment = 0,
  interaction,
}: {
  character: Character;
  adjustment?: number;
  interaction: CommandInteraction;
}): EmbedFieldData[] {
  return [
    {
      name: "Health",
      value: `${character.hp}/${getCharacterStatModified(
        character,
        "maxHP"
      )}\n${hpBar(character, adjustment)}`,
    },
    {
      name: "Experience",
      value: Emoji(interaction, "xp") + " " + character.xp.toString(),
      inline: true,
    },
    {
      name: "Gold",
      value: Emoji(interaction, "gold") + " " + character.gold.toString(),
      inline: true,
    },
  ];
}
