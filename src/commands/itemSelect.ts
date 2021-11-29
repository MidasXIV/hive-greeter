import { MessageSelectMenu } from "discord.js";
import { Item } from "../equipment/Item";

export const itemSelect = ({
  inventory,
  placeholder = "Which item?",
}: {
  inventory: Item[];
  placeholder?: string;
}): MessageSelectMenu =>
  new MessageSelectMenu({
    customId: "item",
    placeholder,
  }).addOptions(
    inventory.map((item, i) => ({
      label: item.name,
      description: item.description,
      value: i.toString(),
    }))
  );
