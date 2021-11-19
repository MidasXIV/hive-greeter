import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { equipItem } from "../character/equipItem";
import { getUserCharacter } from "../character/getUserCharacter";
import { grantCharacterItem } from "../equipment/grantCharacterItem";
import { heavyCrown } from "../heavyCrown/heavyCrown";
import { execute as inspect } from "./inspect";
import store from '@adventure-bot/store'
import { addItemToInventory } from '@adventure-bot/store/slices/characters';

export const command = new SlashCommandBuilder()
  .setName("crown")
  .setDescription("Gain a crown.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  store.dispatch(addItemToInventory({
    character,
    item: heavyCrown,
  }))
  // TODO Equip Item Reducer

  // store.dispatch(addItemToInventory({
  //   character,
  //   item: heavyCrown,
  // }))

  // updateCharacter(
    // equipItem(grantCharacterItem(character, heavyCrown), heavyCrown)
  // );
  // store.dispatch() //grantCharacterItem(character, heavyCrown)
  console.log("granted", heavyCrown);
  inspect(interaction);
};

export default { command, execute };
