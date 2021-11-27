import { CommandInteraction, MessageSelectMenu } from "discord.js";
import { Item } from "../../equipment/Item";

export function purchaseList({
  inventory,
  interaction,
}: {
  inventory: Item[];
  interaction: CommandInteraction;
}): MessageSelectMenu {
  return new MessageSelectMenu({
    customId: "item",
    placeholder: "What would you like to buy?",
    options: inventory.map((item, i) => ({
      label: item.name,
      description: `${item.goldValue}g ${item.description}`,
      value: i.toString(),
    })),
  });
}
