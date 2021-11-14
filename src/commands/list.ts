import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getMonsters } from "../character/getMonsters";
import { getUserCharacter } from "../character/getUserCharacter";
import { getUserCharacters } from "../character/getUserCharacters";
import { limitedCharacterEmbed } from "./limitedCharacterEmbed";

export const command = new SlashCommandBuilder()
  .setName("list")
  .setDescription("List something")
  .addSubcommand((option) =>
    option.setName("characters").setDescription("List all characters")
  )
  .addSubcommand((option) =>
    option.setName("monsters").setDescription("Previously encountered monsters")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  switch (interaction.options.data[0].name) {
    case "characters":
      showCharacters(interaction);
      break;
    case "monsters":
      showMonsters(interaction);
      break;
  }
};

export default { command, execute };

function showCharacters(interaction: CommandInteraction) {
  getUserCharacter(interaction.user); // ensure Character existence to prevent an empty list
  interaction.reply({
    embeds: getUserCharacters()
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)
      .map(limitedCharacterEmbed),
  });
}

function showMonsters(interaction: CommandInteraction) {
  const monsters = Array.from(getMonsters().values());
  interaction.reply({
    embeds: [
      new MessageEmbed({ title: "Monsters seen in the area" }),
      ...(monsters.length > 0
        ? monsters
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10)
            .map(limitedCharacterEmbed)
        : [new MessageEmbed({ description: "No monsters." })]),
    ],
  });
}
