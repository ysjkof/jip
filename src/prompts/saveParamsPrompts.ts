import prompts from 'prompts';
import { patientListAndPrices, userList } from '../index.js';
import {
  getPromptOfDate,
  getPromptOfIsReserved,
  getPromptOfPatient,
  getPromptOfPrice,
  getPromptOfUser,
} from './promptsObj.js';
import { printSavedInfo } from '../cli/output.js';
import type { SaveParams } from '../types/common.type.js';

export const saveParamsPrompts = async (): Promise<SaveParams | null> => {
  if (!userList || !patientListAndPrices) return null;

  const questions: prompts.PromptObject<string>[] = [
    getPromptOfDate(),
    getPromptOfUser(userList),
    getPromptOfPatient(patientListAndPrices.patients),
    getPromptOfPrice(patientListAndPrices.prices),
    getPromptOfIsReserved(),
  ];

  const response = await prompts(questions);

  const date: SaveParams['date'] = response.date;
  const therapist: SaveParams['therapist'] = response.therapist;
  const patient: SaveParams['patientNum'] = response.patient;
  const patientType: SaveParams['patientType'] = '재진';
  const price: SaveParams['price'] = response.price;
  const isReserved: SaveParams['isReserved'] = response.isReserved;

  handleError({
    date,
    therapist,
    patient,
    price,
    isReserved,
  });

  const inputData = {
    date,
    therapist,
    patientNum: patient,
    patientType,
    price,
    isReserved,
  };
  printSavedInfo(inputData);
  return inputData;
};

const handleError = ({
  date,
  therapist,
  patient,
  price,
  isReserved,
}: {
  date: any;
  therapist: any;
  patient: any;
  price: any;
  isReserved: any;
}) => {
  if (date.length !== 6 || typeof Number.parseInt(date, 10) !== 'number') {
    throw new Error('date를 잘못 입력했습니다.');
  }

  if (isReserved !== 'Y' && isReserved !== 'N') {
    throw new Error('예약여부는 Y나 N만 입력');
  }
};

export const inputDate = async (): Promise<SaveParams['date'] | null> => {
  const questions = getPromptOfDate();
  const response = await prompts(questions);
  return response.date;
};

export const inputPrice = async (): Promise<SaveParams['price'] | null> => {
  if (!patientListAndPrices) return null;

  const question: prompts.PromptObject<string> = getPromptOfPrice(
    patientListAndPrices.prices
  );
  const response = await prompts(question);
  return response.price;
};

export const inputUser = async (): Promise<SaveParams['therapist'] | null> => {
  if (!userList) return null;

  const questions: prompts.PromptObject<string> = getPromptOfUser(userList);
  const response = await prompts(questions);
  return response.therapist;
};

export const selectIsReserved = async (): Promise<
  SaveParams['isReserved'] | null
> => {
  const question: prompts.PromptObject<string> = getPromptOfIsReserved();
  const response = await prompts(question);
  return response.isReserved;
};

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
