import prompts from 'prompts';
import { getPromptOfTherapy } from './promptsObj.js';
import { TherapyType } from '../enum.js';

export const therapyPrompts = async (): Promise<TherapyType> => {
  const questions: prompts.PromptObject<string> = getPromptOfTherapy();

  const response = await prompts(questions);
  return response.therapy;
};
