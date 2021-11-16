import { MessageEmbed } from "discord.js";
import { getCharacter } from "../getCharacter";
import { LootResult } from "./loot";

export const lootResultEmbed = (lootResult: LootResult): MessageEmbed => {
  const embed = new MessageEmbed({
    fields: lootResult.itemsTaken.map((item) => ({
      name: item.name,
      value: item.description,
    })),
  }).addField("Gold Taken", `💰 ${lootResult.goldTaken}`);
  const looter = getCharacter(lootResult.looterId);
  const lootee = getCharacter(lootResult.targetId);
  if (looter && lootee) {
    embed.setTitle(`${looter.name} looted ${lootee.name} `);
  }
  lootResult.itemsTaken.forEach((item) =>
    embed.addField(item.name, item.description)
  );
  return embed;
};
