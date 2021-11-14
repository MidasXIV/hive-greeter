import { MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { statFields } from "../commands/inspect";
import { inventoryFields } from "./inventoryFields";

export const characterEncounterEmbed = (character: Character): MessageEmbed =>
  new MessageEmbed({
    title: character.name,
    fields: [...statFields(character), ...inventoryFields(character)],
  }).setThumbnail(character.profile);
