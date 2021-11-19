import { CommandInteraction } from "discord.js";
import { Character } from "@adventure-bot/character/Character";
import { adjustGold } from "@adventure-bot/character/adjustGold";
import { getUserCharacter } from "@adventure-bot/character/getUserCharacter";
import { equipItemPrompt, Item } from "@adventure-bot/equipment/equipment";
import { addItemToInventory } from '@adventure-bot/store/slices/characters';
import store from '@adventure-bot/store'

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
