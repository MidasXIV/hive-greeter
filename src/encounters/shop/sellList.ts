import { CommandInteraction, MessageSelectMenu } from "discord.js";
import { Item } from "../../equipment/Item";
import { sellValue } from "./sellValue";

export function sellList({
  inventory,
}: {
  inventory: Item[];
  interaction: CommandInteraction;
}): MessageSelectMenu {
  return new MessageSelectMenu({
    customId: "item",
    placeholder: `Which item would you like to sell?`,
    options: inventory.map((item, i) => ({
      label: item.name,
      description: `${sellValue(item)}g ${item.description}`,
      value: i.toString(),
    })),
  });
}
