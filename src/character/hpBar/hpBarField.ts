import { EmbedFieldData } from "discord.js";
import { Character } from "../Character";
import { getCharacterStatModified } from "../getCharacterStatModified";
import { hpBar } from "./hpBar";

export const hpBarField = (
  character: Character,
  adjustment = 0
): EmbedFieldData => ({
  name: "HP",
  value: `${character.hp}/${getCharacterStatModified(
    character,
    "maxHP"
  )}\n${hpBar(character, adjustment)}`,
});
