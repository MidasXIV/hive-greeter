import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import store from "../store";
import { updateCharacter } from "../store/slices/characters";

export const command = new SlashCommandBuilder()
  .setName("cleanse")
  .setDescription("Remove all effects.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  store.dispatch(
    updateCharacter({
      ...character,
      statusEffects: [],
    })
  );
  interaction.followUp(`${character.name} cleanses themself`);
};

export default { command, execute };
