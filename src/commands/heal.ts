import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { heal } from "../heal/heal";
import { getUserCharacter } from "../character/getUserCharacter";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { hpBarField } from "../character/hpBar/hpBarField";
import { Emoji } from "../Emoji";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { questProgressField } from "../quest/questProgressField";
import { isUserQuestComplete } from "../quest/isQuestComplete";
import quests from "./quests";

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
  const healer = interaction.user;
  if (!target) {
    await interaction.editReply(`You must specify a target @player`);
    return;
  }

  // TODO: a better way?
  getUserCharacter(target); // ensure character exists for proper interactions
  const result = heal(healer.id, target.id);
  if (!result) {
    interaction.editReply("No result. This should not happen.");
    return;
  }
  if (result.outcome === "cooldown") {
    await interaction.editReply(
      `You can heal again in ${cooldownRemainingText(healer.id, "heal")}.`
    );
    // TODO: setTimeout to edit this when cooldown is available
    return;
  }
  const character = updateUserQuestProgess(healer, "healer", result.amount);

  await interaction.editReply({
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
  if (isUserQuestComplete(healer, "healer")) await quests.execute(interaction);
};

export default { command, execute };
