import prompts from 'prompts';
import { patientListAndPrices } from '../index.js';
import { getPromptOfPrice } from '../prompts/prompts.js';
import type { SaveParams } from '../types/common.type.js';

export const inputPrice = async (): Promise<SaveParams['price'] | null> => {
  if (!patientListAndPrices) return null;

  const question: prompts.PromptObject<string> = getPromptOfPrice(
    patientListAndPrices.prices
  );
  const response = await prompts(question);
  return response.price;
};
