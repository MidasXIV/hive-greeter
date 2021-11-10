import { CommandInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import { getUserCharacter, updateCharacter } from "../../gameState";
import { addQuestProgress } from "../../quest/addQuestProgress";
import { questProgressField } from "../../quest/questProgressField";
import { grantStatusEffect } from "../../status-effets/grantStatusEffect";
import { StatusEffect } from "../../status-effets/StatusEffect";

export const armorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const effect: StatusEffect = {
    name: "Shrine of Protection",
    modifiers: {
      ac: 2,
    },
    duration: 30 * 60000,
    started: new Date().toString(),
  };
  updateCharacter(
    addQuestProgress(getUserCharacter(interaction.user), "blessed", 1)
  );
  grantStatusEffect(interaction.user.id, effect);
  const embed = new MessageEmbed()
    .setTitle("Shrine of Protection")
    .setColor("GREEN")
    .setDescription(`The shrine grants you +${effect.modifiers.ac} ac!`)
    .addField(
      "Expires",
      moment(new Date(effect.started)).add(effect.duration).fromNow()
    )
    .setImage("https://i.imgur.com/mfDAYcQ.png");
  const quest = getUserCharacter(interaction.user).quests.blessed;
  if (quest) embed.addFields([questProgressField(quest)]);
  await interaction.reply({
    embeds: [embed],
  });
};
