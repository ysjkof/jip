import prompts from 'prompts';
import { getPromptOfIsReserved } from '../prompts/prompts.js';
import type { SaveParams } from '../types/common.type.js';

export const selectIsReserved = async (): Promise<
  SaveParams['isReserved'] | null
> => {
  const question: prompts.PromptObject<string> = getPromptOfIsReserved();
  const response = await prompts(question);
  return response.isReserved;
};
