import { CommandInteraction, MessageEmbed } from "discord.js";
import { StatusEffect } from "../../../statusEffects/StatusEffect";
import { shrine } from "./shrine";

export const vigorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const effect: StatusEffect = {
    name: "Shrine of Vigor",
    buff: true,
    debuff: false,
    modifiers: {
      maxHP: 3,
    },
    duration: 30 * 60000,
    started: new Date().toString(),
  };
  shrine(
    interaction,
    effect,
    new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`The shrine grants you +${effect.modifiers.maxHP} maxHP!`)
      .setImage(
        "https://i.pinimg.com/originals/c1/4e/f0/c14ef0766793f8c967f6d685f29d52d6.jpg"
      )
  );
};
