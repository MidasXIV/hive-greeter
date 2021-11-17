import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { characterEmbed } from "../character/characterEmbed";
import {
  getCharacterUpdate,
  getMonsterUpdate,
} from "../character/getCharacterUpdate";
import { getUserCharacter } from "../character/getUserCharacter";
import { inventoryFields } from "../character/inventoryFields";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import { getRandomMonster } from "../monster/getRandomMonster";
import { monsterEmbed } from "./encounters/monsterEmbed";

export const command = new SlashCommandBuilder()
  .setName("lootmonster")
  .setDescription("Loot a random monster.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const monster = getRandomMonster();
  const character = getUserCharacter(interaction.user);
  const result = loot({ looterId: character.id, targetId: monster.id });
  interaction.reply({
    embeds: [
      monsterEmbed(getMonsterUpdate(monster)),
      characterEmbed(getCharacterUpdate(character)).addFields(
        ...inventoryFields(character)
      ),
    ].concat(result ? lootResultEmbed(result) : []),
  });
};

export default { command, execute };
