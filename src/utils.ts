import { CommandInteraction } from "discord.js";
import moment from "moment";
import { Character } from "./character/Character";
import { getCooldownRemaining } from "./gameState";

export const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const cooldownRemainingText = (
  characterId: string,
  type: keyof Character["cooldowns"]
): string => {
  const cooldown = getCooldownRemaining(characterId, type);
  if (cooldown === undefined || cooldown <= 0) return "Now";
  return moment().add(cooldown, "milliseconds").fromNow();
};

export type CommandHandler = (interaction: CommandInteraction) => Promise<void>;
