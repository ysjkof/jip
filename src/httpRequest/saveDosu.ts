import got from 'got';
import { createBody } from '../saveData/createBody.js';
import { SAVE_URL } from './index.js';
import { printSaveDataResult } from '../cli/output.js';
import type { SaveParams, UserList } from '../types/common.type.js';

export const saveDosu = async (
  params: SaveParams,
  cookie: string,
  userList: UserList
) => {
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
  const DOSU_INCEN = 10;
  const body = createBody({
    phy_type: 'm',
    mode: 'add',
    a: '보정탑정형외과의원',
    phy_incen: DOSU_INCEN,
    incen_check: 'Y',
    phy_date: date,
    b: therapist,
    patient_num: patientNum,
    patient_type: patientType,
    phy_price: price,
    appoint_yn: isReserved ? 'Y' : 'N',
    phy_ukey: userKey,
  });

  const response = await got(SAVE_URL, {
    headers,
    body,
    method: 'POST',
  });
  printSaveDataResult(response);
};
