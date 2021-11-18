import { EmbedFieldData } from "discord.js";
import { Character } from "@adventure-bot/character/Character";
import { getCharacterStatModified } from "@adventure-bot/character/getCharacterStatModified";
import { getCharacterUpdate } from "@adventure-bot/character/getCharacterUpdate";
import { hpBar } from "@adventure-bot/character/hpBar/hpBar";

const numberModifierText = (num?: number): string => {
  if (!num) return "";
  if (num > 0) return `+${num}`;
  if (num < 0) return `${num}`;
  return "";
};

export const hpBarField = (
  character: Character,
  adjustment = 0,
  showName = false
): EmbedFieldData => ({
  name: (showName ? character.name + "s " : "") + "HP",
  value: `${getCharacterUpdate(character).hp}/${getCharacterStatModified(
    character,
    "maxHP"
  )}\n${hpBar(character, adjustment)} ${numberModifierText(adjustment)}`,
});
