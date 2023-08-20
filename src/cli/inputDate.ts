import prompts from 'prompts';
import { getPromptOfDate } from '../prompts/prompts.js';
import type { SaveParams } from '../types/common.type.js';

export const inputDate = async (): Promise<SaveParams['date'] | null> => {
  const questions = getPromptOfDate();
  const response = await prompts(questions);
  return response.date;
};
