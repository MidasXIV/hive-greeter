import { updateCharacter } from "../character/updateCharacter";
import { isStatusEffectExpired } from "./isStatusEffectExpired";
import { gameState } from "../gameState";

export const purgeExpiredStatuses = (characterId: string): void => {
  const character = gameState.characters.get(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    statusEffects:
      character.statusEffects?.filter(
        (effect) => !isStatusEffectExpired(effect)
      ) ?? [],
  });
  console.log(`${characterId} status effects purged`);
};
