import { CommandInteraction, MessageEmbed } from "discord.js";
import { StatusEffect } from "../../../status-effets/StatusEffect";
import { shrine } from "./shrine";

export const attackShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const effect: StatusEffect = {
    name: "Shrine of Agression",
    buff: true,
    debuff: false,
    modifiers: {
      attackBonus: 2,
    },
    duration: 30 * 60000,
    started: new Date().toString(),
  };
  shrine(
    interaction,
    effect,
    new MessageEmbed()
      .setColor("DARK_RED")
      .setDescription(
        `The shrine fills you with a vigorous rage, granting you +${effect.modifiers.attackBonus} attack bonus!`
      )
      .setImage("https://i.imgur.com/7qVghXO.png")
  );
};
