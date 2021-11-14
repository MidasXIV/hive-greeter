import { MessageEmbed } from "discord.js";
import { Monster } from "../../monster/Monster";

export const monsterEmbed = (monster: Monster): MessageEmbed =>
  new MessageEmbed({
    title: monster.name,
    color: "RED",
  }).setImage(monster.profile);
