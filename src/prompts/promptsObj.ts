import prompts, { type Choice } from 'prompts';
import MiniSearch from 'minisearch';
import { getToday } from '../lib/dateLib.js';
import type { PatientListAndPrices, UserList } from '../types/common.type.js';

export const getPromptOfDate = (): prompts.PromptObject<string> => {
  const today = getToday(6);
  const question: prompts.PromptObject<string> = {
    type: 'text',
    name: 'date',
    message: `입력날짜를 입력하세요. 년월일 6자리 숫자(오늘은 ${today})입니다.`,
    initial: today,
  };
  return question;
};

export const getPromptOfPrice = (
  prices: string[]
): prompts.PromptObject<string> => {
  const priceChoices = prices.map((price, idx) => ({
    title: `${idx} ${price}`,
    value: price,
  }));
  const question: prompts.PromptObject<string> = {
    type: 'select',
    name: 'price',
    message: '치료금액은?',
    choices: priceChoices,
    initial: 1,
  };
  return question;
};

export const getPromptOfUser = ({
  users,
  loginUser,
}: UserList): prompts.PromptObject<string> => {
  const usersChoice: Choice[] = users.map(({ name }, idx) => ({
    title: `${idx} ${name}`,
    value: name,
  }));
  const defaultUser = users.findIndex(({ name }) => name === loginUser.name);

  const question: prompts.PromptObject<string> = {
    type: 'autocomplete',
    name: 'therapist',
    message: '담당 치료사',
    choices: usersChoice,
    initial: defaultUser,
  };
  return question;
};

export const getPromptOfIsReserved = (): prompts.PromptObject<string> => {
  const question: prompts.PromptObject<string> = {
    type: 'select',
    name: 'isReserved',
    message: '환자는 다음 예약을 하셨나요?',
    choices: [
      { title: '0 예약 안함.', value: 'N' },
      { title: '1 예약 함.', value: 'Y' },
    ] as Choice[],
    initial: 1,
  };
  return question;
};

export const getPromptOfPatient = (
  patients: PatientListAndPrices['patients']
): prompts.PromptObject<string> => {
  const patientsChoice = patients.map((patient) => ({
    title: patient,
  }));
  const miniSearch = new MiniSearch({
    fields: ['title'], // fields to index for full-text search
    storeFields: ['title'], // fields to return with search results
    idField: 'title',
  });
  miniSearch.addAll(patientsChoice);
  const suggest = (input: any): Promise<any> =>
    Promise.resolve(miniSearch.search(input, { prefix: true, fuzzy: 0.5 }));

  const question: prompts.PromptObject<string> = {
    type: 'autocomplete',
    name: 'patient',
    message: '환자번호나 이름을 입력하세요',
    choices: patientsChoice,
    suggest,
  };
  return question;
};

export const getPromptOfTherapy = (): prompts.PromptObject<string> => {
  const question: prompts.PromptObject<string> = {
    type: 'select',
    name: 'therapy',
    message: '환자는 다음 예약을 하셨나요?',
    choices: [
      { title: '0 도수치료', value: 'dosu' },
      { title: '1 체외충격파', value: 'eswt' },
    ] as Choice[],
    initial: 0,
  };
  return question;
};
