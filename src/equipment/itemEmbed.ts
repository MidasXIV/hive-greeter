import { CommandInteraction, MessageEmbed } from "discord.js";
import { Item } from "./Item";
import { isWeapon } from "./equipment";
import { goldValue } from "./goldValue";

export function itemEmbed({
  item,
  interaction,
}: {
  item: Item;
  interaction: CommandInteraction;
}): MessageEmbed {
  const embed = new MessageEmbed({
    title: item.name,
    description: item.description,
    fields: [
      { name: "Gold Value", inline: true, value: goldValue(item, interaction) },
    ],
  });

  if (isWeapon(item) && item.damageMax)
    embed.addField("Damage Max", item.damageMax.toString(), true);

  if (item.modifiers?.attackBonus)
    embed.addField("Attack Bonus", item.modifiers.attackBonus.toString(), true);

  if (item.modifiers?.damageBonus)
    embed.addField("Damage Bonus", item.modifiers.damageBonus.toString(), true);

  if (item.modifiers?.ac)
    embed.addField("Armor Bonus", item.modifiers?.ac.toString());

  if (item.modifiers?.monsterDamageMax)
    embed.addField(
      "Monster Damage Max",
      item.modifiers?.monsterDamageMax.toString()
    );
  embed.addField("Lootable?", item.lootable ? "Yes" : "No");

  return embed;
}
