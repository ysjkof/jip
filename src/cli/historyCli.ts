import { Command } from 'commander';
import { printError, printHistoryPeriod } from './output.js';
import { getList } from '../httpRequest/index.js';
import { getDateOrToday } from '../lib/dateLib.js';
import { parseDataAndPrint } from '../lib/historyLib.js';
import { loginAndLoadUsersAndPatientsAndPrices } from '../lib/authLib.js';
import { TherapyType } from '../enum.js';
import type { UserList } from '../types/common.type.js';

export const historyCli = () => {
  return new Command()
    .command(`history [치료사이름]`)
    .alias('hx')
    .description('저장된 치료 기록을 출력합니다.')
    .option('-d, --date <value...>', '시행 날짜를 입력합니다.')
    .option('-tp, --therapy-type <value>', '치료의 종류를 입력합니다.', 'm')
    .option('-new, --new-patients', '신환 현황을 불러옵니다.')
    .action(async (_userName, { date, therapyType, newPatients }) => {
      try {
        const { cookie, userList } =
          await loginAndLoadUsersAndPatientsAndPrices(TherapyType.Dosu);

        if (date && date.length > 3)
          throw new Error('시작날짜, 끝날짜 2개를 입력할 수 있습니다.');
        const [_startDate, _endDate] =
          date?.sort((a: string, b: string) => +a - +b) || [];
        const startDate = _startDate || getDateOrToday(_startDate, 8);
        const endDate = _endDate || getDateOrToday(_endDate, 8);
        const isOneDay = startDate === endDate;

        const userKey = getUserKey(_userName, userList);
        if (_userName && !userKey)
          throw new Error('입력한 치료사는 없는 이름입니다.');

        const data = await getList(cookie, {
          startDate,
          endDate,
          userKey,
          therapyType: therapyType,
        });

        const userName = userKey && _userName;
        printHistoryPeriod({ startDate, endDate, userName });
        parseDataAndPrint(data, { isOneDay, newPatients });
        printHistoryPeriod({ startDate, endDate, userName });
      } catch (error) {
        // @ts-ignore
        printError(error.message);
        process.exit(1);
      }
    });
};

const getUserKey = (userName: string, userList: UserList) => {
  return userName && userList.users.find((user) => user.name === userName)?.key;
};
