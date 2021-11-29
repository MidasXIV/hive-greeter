import { CommandInteraction } from "discord.js";
import { Character } from "../character/Character";
import { adjustGold } from "../character/adjustGold";
import { getUserCharacter } from "../character/getUserCharacter";
import { grantCharacterItem } from "../equipment/grantCharacterItem";
import { equipItemPrompt } from "../equipment/equipItemPrompt";
import { Item } from "../equipment/Item";
import { updateCharacter } from "../character/updateCharacter";

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
  updateCharacter(grantCharacterItem(getUserCharacter(interaction.user), item));
  equipItemPrompt(interaction, item);
};
