import { CommandInteraction, MessageEmbed } from "discord.js";
import { lootResultEmbed } from "../../character/loot/lootResultEmbed";
import { getLoots } from "../../encounter/getLoots";

export function listLootResults(interaction: CommandInteraction): void {
  const loots = getLoots();
  console.log("listLootResults", loots);
  interaction.reply({
    embeds:
      loots.length > 0
        ? loots
            .sort(
              (a, b) =>
                new Date(a.timestamp).valueOf() -
                new Date(b.timestamp).valueOf()
            )
            .map((lootResult) => lootResultEmbed(lootResult))
            .slice(0, 10)
        : [
            new MessageEmbed({
              description:
                "No loot results yet. `/adventure` to loot some monsters! (or get looted)",
            }),
          ],
  });
}
