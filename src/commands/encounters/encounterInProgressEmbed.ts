import { MessageEmbed } from "discord.js";
import { Encounter } from "../../monster/Encounter";
import { encounterEmbed } from "./encounterEmbed";

// placeholder for future customization of inprogress statistics
export const encounterInProgressEmbed = (
  encounter: Encounter
): MessageEmbed => {
  return encounterEmbed(encounter);
};
