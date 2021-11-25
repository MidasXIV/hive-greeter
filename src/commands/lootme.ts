import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { characterEmbed } from "../character/characterEmbed";
import { getCharacterUpdate } from "../character/getCharacterUpdate";
import { getUserCharacter } from "../character/getUserCharacter";
import { inventoryFields } from "../character/inventoryFields";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import { getRandomMonster } from "../monster/getRandomMonster";
import { monsterEmbed } from "../encounters/monsterEmbed";

export const command = new SlashCommandBuilder()
  .setName("lootme")
  .setDescription(
    "Be knocked out and dragged off by some random monstrocity. Who put this command here and why?"
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const monster = await getRandomMonster();
  const character = getUserCharacter(interaction.user);
  const result = loot({ looterId: monster.id, targetId: interaction.user.id });
  interaction.reply({
    embeds: [
      monsterEmbed(monster),
      characterEmbed(getCharacterUpdate(character)).addFields(
        ...inventoryFields(character)
      ),
    ].concat(result ? lootResultEmbed(result) : []),
  });
};

export default { command, execute };
