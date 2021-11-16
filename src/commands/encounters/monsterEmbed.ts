import { MessageEmbed } from "discord.js";
import { Monster } from "../../monster/Monster";
import { decoratedName } from "../../character/decoratedName";

export const monsterEmbed = (monster: Monster): MessageEmbed =>
  new MessageEmbed({
    title: decoratedName(monster),
    color: "RED",
  })
    .setImage(monster.profile)
    .addField("Gold", monster.gold.toString());
