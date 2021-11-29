import { CommandInteraction, EmbedFieldData, MessageEmbed } from "discord.js";
import { stats, statTitles } from "../character/Stats";
import { Emoji } from "../Emoji";
import { StatusEffect } from "./StatusEffect";

export function statusEffectEmbed(
  effect: StatusEffect,
  interaction: CommandInteraction
): MessageEmbed {
  const fields: EmbedFieldData[] = [];

  stats.forEach((stat) => {
    const modifier = effect.modifiers[stat];
    if (!modifier) return;
    fields.push({
      name: statTitles[stat],
      value: Emoji(interaction, stat) + " " + modifier.toString(),
    });
  });

  return new MessageEmbed({
    title: effect.name,
    fields,
    timestamp: new Date(new Date(effect.started).valueOf() + effect.duration),
  });
}
