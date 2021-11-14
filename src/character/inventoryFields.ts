import { EmbedFieldData } from "discord.js";
import { Character } from "./Character";

export const inventoryFields = (character: Character): EmbedFieldData[] =>
  character.inventory.map((item) => ({
    name: item.type,
    value: item.name,
  }));
