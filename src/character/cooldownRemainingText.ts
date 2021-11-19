import moment from "moment";
import { Character } from "./Character";
import { getCooldownRemaining } from "../getCooldownRemaining";

export const cooldownRemainingText = (
  characterId: string,
  type: keyof Character["cooldowns"]
): string => {
  const cooldown = getCooldownRemaining(characterId, type);
  if (cooldown === undefined || cooldown <= 0) return "Now";
  return moment().add(cooldown, "milliseconds").fromNow();
};
