import got, { OptionsOfTextResponseBody } from 'got';
import { parse } from 'node-html-parser';
import { getToday } from '../lib/dateLib.js';
import { cookie, userList } from '../index.js';
import type { THERAPY_TYPE } from '../types/common.type.js';

export const getPatientListAndPrices = async (type: THERAPY_TYPE) => {
  const userKey = userList?.loginUser.key;
  if (!cookie || !userKey) return null;

  let therapyType;
  if (!therapyType && type === 'dosu') therapyType = 'm';
  if (!therapyType && type === 'eswt') therapyType = 'e';

  const URL = `http://jinsul.co.kr/erp/physical/?p=15&mode=add&tp=${therapyType}&u=${userKey}&w=${getToday(
    8
  )}`;

  const options: OptionsOfTextResponseBody | undefined = {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'ko',
      'cache-control': 'max-age=0',
      'upgrade-insecure-requests': '1',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      Referer: URL,
      cookie,
    },
    method: 'GET',
  };

  const response = await got(URL, options);
  if (response.statusCode !== 200) throw new Error('statusCode is not 200');

  const root = parse(response.body);
  const patientListEl = root.querySelectorAll('#patient_num option');
  const pricesEl = root.querySelectorAll('[name="phy_price"] option');

  // 환자를 "<환자번호> - <환자이름>" 형태로 반환한다.
  const patients = patientListEl.map((option) => option.text);
  const prices = pricesEl.map((option) => option.attributes['value']);

  return { patients, prices };
};
