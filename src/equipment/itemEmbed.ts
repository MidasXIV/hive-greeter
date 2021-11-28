import { CommandInteraction, EmbedFieldData, MessageEmbed } from "discord.js";
import { Item } from "./Item";
import { goldValue } from "./goldValue";
import { stats, statTitles } from "../character/Stats";
import { Emoji } from "../Emoji";
import { getUserCharacter } from "../character/getUserCharacter";
import { isEquipped } from "./isEquipped";

export function itemEmbed({
  item,
  interaction,
  showEqupStatus = false,
}: {
  item: Item;
  interaction: CommandInteraction;
  showEqupStatus?: boolean;
}): MessageEmbed {
  const fields: EmbedFieldData[] = [];
  stats.forEach((stat) => {
    const modifier = item.modifiers?.[stat];
    if (!modifier) return;
    fields.push({
      name: statTitles[stat],
      value: Emoji(interaction, stat) + " " + modifier.toString(),
    });
  });

  const embed = new MessageEmbed({
    title: item.name,
    description: item.description,
    fields: [
      ...fields,
      { name: "Gold Value", inline: true, value: goldValue(item, interaction) },
    ],
  });

  embed.addField("Lootable?", item.lootable ? "Yes" : "No");

  if (showEqupStatus) {
    const character = getUserCharacter(interaction.user);
    embed.addField("Equipped?", isEquipped({ character, item }) ? "Yes" : "No");
  }
  return embed;
}
