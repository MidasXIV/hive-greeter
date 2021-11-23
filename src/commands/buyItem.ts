import { CommandInteraction } from "discord.js";
import { Character } from "../character/Character";
import { adjustGold } from "../character/adjustGold";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipItemPrompt, Item } from "../equipment/equipment";
import { addItemToInventory } from '../store/slices/characters';
import store from '../store'

export const buyItem = async (
  interaction: CommandInteraction,
  player: Character,
  item: Item
): Promise<void> => {
  if (player.gold < item.goldValue) {
    await interaction.followUp(
      `You cannot afford the ${item.name}. You have only ${player.gold} gold and it costs ${item.goldValue}.`
    );
    return;
  }
  adjustGold(player.id, -item.goldValue);
  store.dispatch(addItemToInventory({
    character: getUserCharacter(interaction.user),
    item,
  }))
  await equipItemPrompt(interaction, item);
};
