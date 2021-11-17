import { MessageEmbed } from "discord.js";
import { getCharacter } from "../getCharacter";
import { LootResult } from "./loot";

export const lootResultEmbed = (lootResult: LootResult): MessageEmbed => {
  const embed = new MessageEmbed({}).addField(
    "Gold",
    `💰 ${lootResult.goldTaken}`
  );
  const looter = getCharacter(lootResult.looterId);
  const lootee = getCharacter(lootResult.targetId);
  if (looter && lootee) {
    embed.setTitle(`${looter.name} looted ${lootee.name} `);
    embed.setImage(lootee.profile);
    embed.setThumbnail(looter.profile);
  }
  lootResult.itemsTaken.forEach((item) =>
    embed.addField(item.name, item.description)
  );
  return embed;
};
