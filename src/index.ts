#! /usr/bin/env node

import { inputSaveParams } from './cli/inputSaveParams.js';
import { saveData } from './httpRequest/saveData.js';
import { getPatientListAndPrices } from './httpRequest/getPatientListAndPrices.js';
import { getUserList } from './httpRequest/getUserList.js';
import { isNewPatient } from './lib/patientLib.js';
import { isContinueInput, isInitInteractiveUI } from './cli/inputYesOrNo.js';
import { login } from './auth/login.js';
import { Command } from 'commander';
import { logout } from './auth/logout.js';
import { inputLoginParams } from './cli/inputLoginParams.js';
import { saveIdAndPassword } from './auth/saveIdAndPassword.js';
import { getToday, isValidDateFormat } from './lib/dateLib.js';
import { matchPriceDigit } from './lib/priceLib.js';
import {
  printFailSaveLogin,
  printLine,
  printSavedInfo,
  printSuccessSaveLogin,
} from './cli/output.js';
import { selectPatient } from './cli/selectPatient.js';
import type {
  PATIENT_TYPE,
  PatientListAndPrices,
  UserList,
} from './types/common.type.js';

export let cookie: string | undefined;
export let userList: UserList | null;
export let patientListAndPrices: PatientListAndPrices | null;

const loadUsersAndPatients = async () => {
  userList = await getUserList();
  patientListAndPrices = await getPatientListAndPrices();
};

const loginAndLoadUsersAndPatients = async () => {
  cookie = await login();
  await loadUsersAndPatients();
};

const receiveInputAndSave = async () => {
  if (!patientListAndPrices) return;
  const saveParams = await inputSaveParams();

  if (!saveParams) return;
  await saveData(saveParams);
};

const initInteractiveUI = async () => {
  // if (await isNewPatient()) {
  //   // 신규 환자 등록
  // }
  await receiveInputAndSave();
  if (await isContinueInput()) initInteractiveUI();
};

const program = new Command();

program
  .name('jip')
  .description(
    'CLI program for input of JINSUL ERP\n진설 ERP의 입력을 위한 CLI 프로그램.'
  )
  .version('1.0.0', '-v, --version', '프로그램의 버전을 출력한다.')
  .helpOption('-h, --help', '도움말을 출력한다.')
  .hook('preAction', async () => {
    printLine();
  });

program
  .command('default', { hidden: true, isDefault: true })
  .description('기본동작. 대화형 인터페이스를 시작한다.')
  .action(async (id, pw) => {
    program.outputHelp();
    if (await isInitInteractiveUI()) {
      await loginAndLoadUsersAndPatients();
      initInteractiveUI();
    }
  });

program
  .command('login')
  .description(
    'ID와 비밀번호를 저장한다. 비밀번호를 생략하면 ID를 비밀번호로 사용한다.'
  )
  .argument('[ID]', '아이디(ID)')
  .argument('[Password]', '비밀번호(Password)')
  .action(async (id, pw) => {
    let idAndPassword = { id, password: pw };
    if (!id) idAndPassword = await inputLoginParams();
    else if (id && !pw) idAndPassword.password = id;

    const result = saveIdAndPassword(idAndPassword);
    if (result) return printFailSaveLogin();
    return printSuccessSaveLogin();
  });

program
  .command('logout')
  .description('저장된 ID와 비밀번호 제거합니다.')
  .action(() => {
    logout();
  });

program
  .command('ds [환자번호]')
  .description('도수치료 시행 결과를 입력합니다.')
  .option('-d, --date <value>', '시행 날짜를 입력합니다.')
  .option('-t, --therapist <value>', '담당 치료사를 입력합니다.')
  .option('-p, --price <value>', '가격을 입력합니다.')
  .option('-f, --first', '신환이면 입력합니다.', false)
  .option('-nr, --no-reserved', '예약하지 않았을 때 입력합니다.')
  .action(async (_patientNum, options) => {
    if (options.date && !isValidDateFormat(options.date))
      throw new Error('날짜는 년월일 6자리나 월일 4자리를 입력한다.');
    const date = options.date || getToday(6);

    await loginAndLoadUsersAndPatients();

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
    const existTherapist = users.some(({ name }) => name === options.therapist);
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

    printSavedInfo(inputData);
    saveData(inputData);
  });

program.parse();
