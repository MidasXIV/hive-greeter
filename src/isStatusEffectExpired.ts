import { StatusEffect } from "./statusEffects/StatusEffect";

export const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  Date.now() > new Date(effect.started).valueOf() + effect.duration;
