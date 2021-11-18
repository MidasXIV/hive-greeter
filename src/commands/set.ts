import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { setProfile } from "../character/setProfile";
import { execute as inspect } from "./inspect";

export const command = new SlashCommandBuilder()
  .setName("set")
  .setDescription("Configure your character")
  .addStringOption((option) =>
    option
      .setName("profile")
      .setDescription(`Set your character's profile picture.`)
      .setRequired(true)
  );

if (process.env.DEV_COMMANDS === "true") {
  command.addStringOption((i) => i.setName("hp").setDescription("Set hp"));
  command.addIntegerOption((i) => i.addChoice("Choice", 1));
}
export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const url = interaction.options.data[0].value?.toString();
  if (!url) return;
  setProfile(interaction.user.id, url);

  await inspect(interaction);
};

export default { command, execute };
