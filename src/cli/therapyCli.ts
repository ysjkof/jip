import { Command } from 'commander';
import { getDateOrToday } from '../lib/dateLib.js';
import { validatePrice } from '../lib/priceLib.js';
import { printError, printSavedInfo } from './output.js';
import { patientPrompts, pricePrompts, userPrompts } from '../prompts/index.js';
import { saveDosu, saveEswt } from '../httpRequest/index.js';
import { loadConfig } from '../config/index.js';
import { TherapyType } from '../enum.js';
import { loginAndLoadUsersAndPatientsAndPrices } from '../lib/authLib.js';
import { isValidUser } from '../lib/userLib.js';
import type { PATIENT_TYPE } from '../types/common.type.js';

const therapyCli = (therapyType: TherapyType, saveTherapy: Function) => {
  const alias = getTherapyAlias(therapyType);
  return new Command()
    .command(`${therapyType} [환자번호]`)
    .alias(alias)
    .description('치료 시행 결과를 입력합니다.')
    .option('-d, --date <value>', '시행 날짜를 입력합니다.')
    .option('-t, --therapist <value>', '담당 치료사를 입력합니다.')
    .option('-p, --price <value>', '가격을 입력합니다.')
    .option('-f, --first', '신환이면 입력합니다.', false)
    .option('-nr, --no-reserved', '예약하지 않았을 때 입력합니다.')
    .action(async (_patientNum, options) => {
      try {
        const date = getDateOrToday(options.date);
        const { cookie, patientListAndPrices, userList } =
          await loginAndLoadUsersAndPatientsAndPrices(therapyType);

        if (options.therapist) isValidUser(options.therapist, userList.users);
        let therapist =
          options.therapist || (await loadConfig()).defaultTherapist;

        if (!therapist) {
          therapist = await userPrompts(userList);
        }

        if (options.price)
          validatePrice(options.price, patientListAndPrices.prices);
        let price = options.price;

        if (!price) {
          price = await pricePrompts(patientListAndPrices.prices);
        }

        const patientNum =
          _patientNum || (await patientPrompts(patientListAndPrices));

        const patientType: PATIENT_TYPE = options.first ? '신환' : '재진';
        const isReserved = options.reserved;

        const inputData = {
          date,
          therapist,
          patientNum,
          patientType,
          price,
          isReserved,
        };

        printSavedInfo(therapyType, patientListAndPrices, inputData);
        saveTherapy(inputData, cookie, userList);
      } catch (error) {
        // @ts-ignore
        printError(error.message);
        process.exit(1);
      }
    });
};

function getTherapyAlias(therapyType: TherapyType) {
  switch (therapyType) {
    case TherapyType.Dosu:
      return 'ds';
    case TherapyType.Eswt:
      return 'et';
    default:
      return '';
  }
}

export const dosuCli = () => therapyCli(TherapyType.Dosu, saveDosu);
export const eswtCli = () => therapyCli(TherapyType.Eswt, saveEswt);
