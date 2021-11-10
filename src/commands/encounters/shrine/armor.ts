import { CommandInteraction, MessageEmbed } from "discord.js";
import { StatusEffect } from "../../../status-effets/StatusEffect";
import { shrine } from "./shrine";

export const armorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const effect: StatusEffect = {
    name: "Shrine of Protection",
    modifiers: {
      ac: 2,
    },
    duration: 30 * 60000,
    buff: true,
    debuff: false,
    started: new Date().toString(),
  };
  shrine(
    interaction,
    effect,
    new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`The shrine grants you +${effect.modifiers.ac} ac!`)
      .setImage("https://i.imgur.com/mfDAYcQ.png")
  );
};
