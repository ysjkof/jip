import { Command } from 'commander';
import { userPrompts } from '../prompts/index.js';
import { printFinishSaveConfig, printSavedConfig } from './output.js';
import { loginAndLoadUsersAndPatientsAndPrices } from '../lib/authLib.js';
import { loadConfig, saveConfig } from '../config/index.js';
import { TherapyType } from '../enum.js';

export const configCli = () => {
  return new Command()
    .command('config')
    .alias('cf')
    .description('각종 명령의 기본 값을 설정합니다.')
    .option('-l, --list', '현재 기본 값을 출력합니다.')
    .action(async (options) => {
      const prevConfig = await loadConfig();
      const { list } = options;

      if (list) return printSavedConfig(await loadConfig());

      const { userList } = await loginAndLoadUsersAndPatientsAndPrices(
        TherapyType.Dosu
      );

      const defaultTherapist = await userPrompts(userList);

      // TODO: 기본 가격 설정

      const option = { ...prevConfig, defaultTherapist };
      saveConfig(option);
      printFinishSaveConfig();
    });
};
