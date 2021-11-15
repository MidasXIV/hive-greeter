import { Character } from "./Character";

export const defaultCooldowns: {
  [key in keyof Character["cooldowns"]]: number;
} = {
  renew: 120 * 60000,
  adventure: 5 * 60000,
  attack: 5 * 60000,
  heal: 5 * 60000,
};
