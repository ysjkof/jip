import { Command } from 'commander';
import {
  loginAndLoadUsersAndPatientsAndPrices,
  patientListAndPrices,
  userList,
} from '../index.js';
import { getToday, isValidDateFormat } from '../lib/dateLib.js';
import { matchPriceDigit } from '../lib/priceLib.js';
import { printSavedInfo } from './output.js';
import { selectPatient } from '../prompts/saveParamsPrompts.js';
import { saveEswt } from '../httpRequest/saveEswt.js';
import type { PATIENT_TYPE } from '../types/common.type.js';

const ESWT = 'eswt';
export const eswtCli = () => {
  const dosu = new Command()
    .command(`${ESWT} [환자번호]`)
    .alias('et')
    .description('체외충격파 시행 결과를 입력합니다.')
    .option('-d, --date <value>', '시행 날짜를 입력합니다.')
    .option('-t, --therapist <value>', '담당 치료사를 입력합니다.')
    .option('-p, --price <value>', '가격을 입력합니다.')
    .option('-f, --first', '신환이면 입력합니다.', false)
    .option('-nr, --no-reserved', '예약하지 않았을 때 입력합니다.')
    .action(async (_patientNum, options) => {
      if (options.date && !isValidDateFormat(options.date))
        throw new Error('날짜는 년월일 6자리나 월일 4자리를 입력한다.');
      const date = options.date || getToday(6);

      await loginAndLoadUsersAndPatientsAndPrices(ESWT);

      const prices = patientListAndPrices?.prices;
      if (!prices) throw new Error('가격 정보가 없다.');
      if (!userList) throw new Error('치료사 정보가 없다.');

      let price = prices.at(-1) || prices[0];
      if (options.price && !prices.includes(price))
        throw new Error('등록되지 않은 가격입니다.');
      if (options.price) {
        price = matchPriceDigit(options.price);
      }

      const { loginUser, users } = userList;
      const existTherapist = users.some(
        ({ name }) => name === options.therapist
      );
      if (options.therapist && !existTherapist) {
        throw new Error('등록된 치료사가 아니야. 이름을 정확히 입력해.');
      }

      const therapist = options.therapist || loginUser.name;
      const patientType: PATIENT_TYPE = options.first ? '신환' : '재진';
      const isReserved = options.reserved;
      let patientNum = _patientNum;
      if (!_patientNum) patientNum = await selectPatient();

      const inputData = {
        date,
        therapist,
        patientNum,
        patientType,
        price: +price,
        isReserved,
      };

      printSavedInfo(ESWT, inputData);
      saveEswt(inputData);
    });
  return dosu;
};
