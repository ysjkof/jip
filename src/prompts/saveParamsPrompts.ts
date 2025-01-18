import prompts from 'prompts';
import {
  getPromptOfDate,
  getPromptOfIsReserved,
  getPromptOfPatient,
  getPromptOfPrice,
  getPromptOfUser,
} from './promptsObj.js';
import { printSavedInfo } from '../cli/output.js';
import { TherapyType } from '../enum.js';
import type {
  PatientListAndPrices,
  SaveParams,
  UserList,
} from '../types/common.type.js';

export const saveParamsPrompts = async (
  therapy: TherapyType,
  userList: UserList,
  patientListAndPrices: PatientListAndPrices
): Promise<SaveParams> => {
  const questions: prompts.PromptObject<string>[] = [
    getPromptOfDate(),
    getPromptOfUser(userList),
    getPromptOfPatient(patientListAndPrices.patients),
    getPromptOfPrice(patientListAndPrices.prices),
    getPromptOfIsReserved(),
  ];

  const response = await prompts(questions);

  const patient: PatientListAndPrices['patients'][0] = response.patient
    ? response.patient
    : patientListAndPrices.patients[0];

  const date: SaveParams['date'] = response.date;
  const therapist: SaveParams['therapist'] = response.therapist;
  const patientNum: SaveParams['patientNum'] = +patient.split(' - ')[0];
  const patientType: SaveParams['patientType'] = '재진';
  const price: SaveParams['price'] = response.price;
  const isReserved: SaveParams['isReserved'] = response.isReserved;

  const inputData = {
    date,
    therapist,
    patientNum,
    patientType,
    price,
    isReserved,
  };
  printSavedInfo(therapy, patientListAndPrices, inputData);
  return inputData;
};

export const datePrompts = async (): Promise<SaveParams['date']> => {
  const questions = getPromptOfDate();
  const response = await prompts(questions);
  return response.date;
};

export const pricePrompts = async (
  prices: PatientListAndPrices['prices']
): Promise<SaveParams['price']> => {
  const question: prompts.PromptObject<string> = getPromptOfPrice(prices);
  const response = await prompts(question);
  return +response.price;
};

export const userPrompts = async (
  userList: UserList
): Promise<SaveParams['therapist']> => {
  const questions: prompts.PromptObject<string> = getPromptOfUser(userList);
  const response = await prompts(questions);
  return response.therapist;
};

export const isReservedPrompts = async (): Promise<
  SaveParams['isReserved']
> => {
  const question: prompts.PromptObject<string> = getPromptOfIsReserved();
  const response = await prompts(question);
  return response.isReserved;
};

export const patientPrompts = async (
  patientListAndPrices: PatientListAndPrices
): Promise<SaveParams['patientNum']> => {
  const question: prompts.PromptObject<string> = getPromptOfPatient(
    patientListAndPrices.patients
  );
  const response = await prompts(question);
  return response.patient.split(' - ')[0];
};
