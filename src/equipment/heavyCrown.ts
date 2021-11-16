import { gameState } from "../gameState";
import { Hat } from "./equipment";

export const heavyCrown: Hat = {
  name: "heavy crown",
  description: "Beset with jewels, in the daylight it commands the eye.",
  equippable: true,
  goldValue: 300,
  type: "hat",
  modifiers: {
    maxHP: 5,
    attackBonus: +2,
    damageBonus: 3,
    ac: -2,
  },
  lootable: true,
};

export const isHeavyCrownInPlay = (): boolean => gameState.isHeavyCrownInPlay;
