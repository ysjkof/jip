import prompts from 'prompts';
import { userList } from '../index.js';
import { getPromptOfUser } from '../prompts/prompts.js';
import type { SaveParams } from '../types/common.type.js';

export const inputUser = async (): Promise<SaveParams['therapist'] | null> => {
  if (!userList) return null;

  const questions: prompts.PromptObject<string> = getPromptOfUser(userList);
  const response = await prompts(questions);
  return response.therapist;
};
