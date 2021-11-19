import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { heal } from "../heal/heal";
import { getUserCharacter } from "../character/getUserCharacter";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { hpBarField } from "../character/hpBar/hpBarField";
import { Emoji } from "../Emoji";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { questProgressField } from "../quest/questProgressField";

export const command = new SlashCommandBuilder()
  .setName("heal")
  .setDescription("Heal someone")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to heal").setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const target = interaction.options.data[0].user;
  const initiator = interaction.user;
  if (!target) {
    await interaction.reply(`You must specify a target @player`);
    return;
  }

  // TODO: a better way?
  getUserCharacter(target); // ensure character exists for proper interactions
  const result = heal(initiator.id, target.id);
  if (!result) return interaction.reply("No result. This should not happen.");
  if (result.outcome === "cooldown") {
    await interaction.reply(
      `You can heal again in ${cooldownRemainingText(initiator.id, "heal")}.`
    );
    // TODO: setTimeout to edit this when cooldown is available
    return;
  }
  const character = updateUserQuestProgess(
    interaction.user,
    "healer",
    result.amount
  );

  await interaction.reply({
    embeds: [
      new MessageEmbed({
        title: "Heal",
        description: `Healed ${target} for ${Emoji(interaction, "heal")} ${
          result.amount
        }!`,
        fields: [hpBarField(getUserCharacter(target), result.amount)].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage("https://i.imgur.com/S32LDbM.png"),
    ].concat(),
  });
};

export default { command, execute };
