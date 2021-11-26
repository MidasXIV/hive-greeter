import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "./Character";
import { statFields } from "../commands/inspect";
import { inventoryFields } from "./inventoryFields";

export const characterEncounterEmbed = (
  character: Character,
  interaction: CommandInteraction
): MessageEmbed =>
  new MessageEmbed({
    title: character.name,
    fields: [
      ...statFields(character, interaction),
      ...inventoryFields(character),
    ],
  }).setThumbnail(character.profile);
