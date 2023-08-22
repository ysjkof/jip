#! /usr/bin/env node
import { Command } from 'commander';
import { login } from './auth/login.js';
import { printLine, printNotExistCmd } from './cli/output.js';
import { getUserList } from './httpRequest/getUserList.js';
import { getPatientListAndPrices } from './httpRequest/getPatientListAndPrices.js';
import { logoutCli } from './cli/logoutCli.js';
import { loginCli } from './cli/loginCli.js';
import { dosuCli } from './cli/dosuCli.js';
import { interactiveCli } from './cli/interactiveCli.js';
import type { PatientListAndPrices, UserList } from './types/common.type.js';

export let cookie: string | undefined;
export let userList: UserList | null;
export let patientListAndPrices: PatientListAndPrices | null;

const loadUsersAndPatients = async () => {
  userList = await getUserList();
  patientListAndPrices = await getPatientListAndPrices();
};

export const loginAndLoadUsersAndPatients = async () => {
  cookie = await login();
  await loadUsersAndPatients();
};

const jip = new Command()
  .name('jip')
  .description(
    'CLI program for input of JINSUL ERP\n진설 ERP의 입력을 위한 CLI 프로그램.'
  )
  .version('1.0.3', '-v, --version', '프로그램의 버전을 출력한다.')
  .helpOption('-h, --help', '도움말을 출력한다.')
  .hook('preAction', async () => {
    printLine();
  });

jip.addCommand(interactiveCli(), { hidden: true, isDefault: true });
jip.addCommand(loginCli());
jip.addCommand(logoutCli());
jip.addCommand(dosuCli());

jip.parse(process.argv);

let isExistArg = false;
const validArg = process.argv[2];

jip.commands.some((command) => {
  if (command.name() === validArg) {
    isExistArg = true;
    return;
  }
});

if (!validArg) {
  jip.outputHelp();
}
if (validArg && !isExistArg) {
  jip.outputHelp();
  printNotExistCmd();
}
