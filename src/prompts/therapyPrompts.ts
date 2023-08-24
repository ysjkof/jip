import prompts from 'prompts';
import { getPromptOfTherapy } from './promptsObj.js';
import { THERAPY_TYPE } from '../types/common.type.js';

export const therapyPrompts = async (): Promise<THERAPY_TYPE> => {
  const questions: prompts.PromptObject<string> = getPromptOfTherapy();

  const response = await prompts(questions);
  return response.therapy;
};
