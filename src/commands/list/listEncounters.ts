import { CommandInteraction, MessageEmbed } from "discord.js";
import { getEncounters } from "../../encounter/getEncounters";
import { encounterEmbed } from "../encounters/encounterEmbed";

// TODO: shows incorrect HP current/total
export function listEncounters(interaction: CommandInteraction): void {
  const encounters = getEncounters();
  interaction.reply({
    embeds:
      encounters.size > 0
        ? Array.from(encounters.values())
            .map((encounter) => encounterEmbed(encounter))
            .slice(0, 10)
        : [
            new MessageEmbed({
              description: "No encounters yet. `/adventure` to find some!",
            }),
          ],
  });
}
