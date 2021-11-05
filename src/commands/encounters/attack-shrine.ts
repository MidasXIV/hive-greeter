import { CommandInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import { grantStatusEffect, StatModifier } from "../../db";

export const attackShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const effect: StatModifier = {
    name: "Shrine of Agression",
    modifiers: {
      attackBonus: 2,
    },
    duration: 30 * 60000,
    started: new Date().toString(),
  };
  grantStatusEffect(interaction.user.id, effect);
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Shrine of Agression")
        .setColor("DARK_RED")
        .setDescription(
          `The shrine fills you with a vigorous rage, granting you +${effect.modifiers.attackBonus} attack bonus!`
        )
        .addField(
          "Expires",
          moment(new Date(effect.started)).add(effect.duration).fromNow()
        )
        .setImage("https://i.imgur.com/7qVghXO.png"),
    ],
  });
};
