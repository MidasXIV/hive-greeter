import { SlashCommandBuilder } from "@discordjs/builders";
import { shop } from "../encounters/shop";

export const command = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("If you have coin, game has wares.");

export const execute = shop;

export default { command, execute };
