import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { equipItem } from "../character/equipItem";
import { getUserCharacter } from "../character/getUserCharacter";
import { updateCharacter } from "../character/updateCharacter";
import { heavyCrown } from "../equipment/equipment";
import { grantCharacterItem } from "../equipment/grantCharacterItem";
import { execute as inspect } from "./inspect";

export const command = new SlashCommandBuilder()
  .setName("crown")
  .setDescription("Gain a crown.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  grantCharacterItem(getUserCharacter(interaction.user), heavyCrown);
  updateCharacter(equipItem(getUserCharacter(interaction.user), heavyCrown));
  inspect(interaction);
};

export default { command, execute };
