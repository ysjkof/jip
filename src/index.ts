#! /usr/bin/env node
import { Command } from 'commander';
import { printLine, printNotExistCmd } from './cli/output.js';
import { logoutCli } from './cli/logoutCli.js';
import { loginCli } from './cli/loginCli.js';
import { interactiveCli } from './cli/interactiveCli.js';
import { dosuCli, eswtCli } from './cli/therapyCli.js';

const jip = new Command()
  .name('jip')
  .description(
    'CLI program for input of JINSUL ERP\n진설 ERP의 입력을 위한 CLI 프로그램.'
  )
  .version('1.1.2', '-v, --version', '프로그램의 버전을 출력한다.')
  .helpOption('-h, --help', '도움말을 출력한다.')
  .hook('preAction', async () => {
    printLine();
  });

jip.addCommand(interactiveCli(), { hidden: true, isDefault: true });
jip.addCommand(loginCli());
jip.addCommand(logoutCli());
jip.addCommand(dosuCli());
jip.addCommand(eswtCli());

jip.parse(process.argv);

const validArg = process.argv[2];
const isExistArg = jip.commands.some(
  (command) => command.name() === validArg || command.alias() === validArg
);

if (!validArg || !isExistArg) {
  jip.outputHelp();
  if (validArg) printNotExistCmd();
}
