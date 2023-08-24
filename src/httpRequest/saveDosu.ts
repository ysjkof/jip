import got, { type OptionsOfTextResponseBody } from 'got';
import { createBody } from '../saveData/createBody.js';
import { SAVE_URL } from './index.js';
import { cookie, userList } from '../index.js';
import type { SaveParams } from '../types/common.type.js';
import { printSaveDataResult } from '../cli/output.js';

export const saveDosu = async (params: SaveParams) => {
  if (!userList) return;
  const { date, therapist, patientNum, patientType, price, isReserved } =
    params;

  const userKey = userList.users.find((user) => user.name === therapist)?.key;
  if (!userKey) throw new Error('saveData()에서 userKey를 찾지 못했다.');

  const headers = {
    accept: 'text/plain, */*; q=0.01',
    'accept-language': 'ko-KR',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-with': 'XMLHttpRequest',
    Referer: `http://jinsul.co.kr/erp/physical/?p=15&mode=add&tp=m&u=${userKey}&w=${date}`,
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    cookie,
  };
  const body = createBody({
    phy_type: 'm',
    mode: 'add',
    a: '보정탑정형외과의원',
    phy_incen: 10,
    incen_check: 'Y',
    phy_date: date,
    b: therapist,
    patient_num: patientNum,
    patient_type: patientType,
    phy_price: price,
    appoint_yn: isReserved ? 'Y' : 'N',
    phy_ukey: userKey,
  });
  const options: OptionsOfTextResponseBody | undefined = {
    headers,
    body,
    method: 'POST',
  };

  const response = await got(SAVE_URL, options);
  printSaveDataResult(response);
};
