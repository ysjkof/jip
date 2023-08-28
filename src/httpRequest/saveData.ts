import got from 'got';
import { createQueryStringFromObject } from '../lib/httpRequestLib.js';
import { printSaveDataResult } from '../cli/output.js';
import { toKorDateFromString } from '../lib/dateLib.js';
import { DOSU_INCEN, ESWT_INCEN, ORIGIN, SAVE_URL } from '../constant.js';
import type {
  BodyProps,
  PHY_TYPE,
  SaveParams,
  UserList,
} from '../types/common.type.js';

export const saveData = async (
  params: SaveParams,
  cookie: string,
  userList: UserList,
  phy_type: PHY_TYPE,
  phy_incen: number
) => {
  const mode = 'add';
  const { date, therapist, patientNum, patientType, price, isReserved } =
    params;

  const userKey = userList.users.find((user) => user.name === therapist)?.key;
  if (!userKey) throw new Error('saveData()에서 userKey를 찾지 못했다.');

  const headers = {
    accept: 'text/plain, */*; q=0.01',
    'accept-language': 'ko-KR',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-with': 'XMLHttpRequest',
    Referer: `${ORIGIN}?p=15&mode=${mode}&tp=${phy_type}&u=${userKey}&w=${date}`,
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    cookie,
  };

  const bodyProps: BodyProps = {
    mode,
    phy_type,
    phy_ukey: userKey,
    phy_date: date,
    d: toKorDateFromString(date),
    a: '보정탑정형외과의원',
    b: therapist,
    room_num: 1,
    phy_incen,
    incen_check: 'Y',
    patient_num: patientNum,
    patient_type: patientType,
    phy_price: price,
    discount_price: undefined,
    replace_price: undefined,
    replace_memo: undefined,
    appoint_yn: isReserved ? 'Y' : 'N',
  };
  const body = createQueryStringFromObject(bodyProps);

  const response = await got(SAVE_URL, {
    headers,
    body,
    method: 'POST',
  });
  printSaveDataResult(response);
};

export const saveDosu = async (
  params: SaveParams,
  cookie: string,
  userList: UserList
) => {
  return saveData(params, cookie, userList, 'm', DOSU_INCEN);
};

export const saveEswt = async (
  params: SaveParams,
  cookie: string,
  userList: UserList
) => {
  return saveData(params, cookie, userList, 'e', ESWT_INCEN);
};
