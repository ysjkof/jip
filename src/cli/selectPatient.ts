import prompts from 'prompts';
import { patientListAndPrices } from '../index.js';
import { getPromptOfPatient } from '../prompts/prompts.js';
import type { SaveParams } from '../types/common.type.js';

export const selectPatient = async (): Promise<
  SaveParams['patientNum'] | null
> => {
  if (!patientListAndPrices) return null;

  const question: prompts.PromptObject<string> = getPromptOfPatient(
    patientListAndPrices.patients
  );
  const response = await prompts(question);
  return response.patient;
};
