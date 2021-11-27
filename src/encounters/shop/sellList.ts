import { CommandInteraction, MessageSelectMenu } from "discord.js";
import { Item } from "../../equipment/Item";

export function sellList({
  inventory,
  percent,
}: {
  inventory: Item[];
  interaction: CommandInteraction;
  percent: number;
}): MessageSelectMenu {
  return new MessageSelectMenu({
    customId: "item",
    placeholder: `Which item would you like to buy? ${(percent * 100).toFixed(
      0
    )}`,
    options: inventory.map((item, i) => ({
      label: item.name,
      description: `${item.goldValue}g ${item.description}`,
      value: i.toString(),
    })),
  });
}
