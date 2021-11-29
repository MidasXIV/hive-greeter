import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { addItemToInventory } from "../store/slices/characters";
import { heavyCrown } from "../equipment/items/heavyCrown";
import { execute as inspect } from "./inspect/inspect";
import store from "store";

export const command = new SlashCommandBuilder()
  .setName("crown")
  .setDescription("Gain a crown.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const crown = heavyCrown();
  store.dispatch(
    addItemToInventory({
      character,
      item: crown,
    })
  );
  // TODO Equip Item Reducer

  console.log("granted", heavyCrown);
  console.log("granted", crown);
  inspect(interaction);
};

export default { command, execute };
