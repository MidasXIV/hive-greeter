import { MessageEmbed } from "discord.js";
import { StatusEffect } from "./StatusEffect";

export function statusEffectEmbed(effect: StatusEffect): MessageEmbed {
  return new MessageEmbed({
    title: effect.name,
    fields: Object.entries(effect.modifiers).map(([name, value]) => ({
      name,
      value: value.toString(),
    })),
    timestamp: new Date(new Date(effect.started).valueOf() + effect.duration),
  });
}
