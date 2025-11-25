import got, { OptionsOfTextResponseBody } from 'got';
import { parse } from 'node-html-parser';
import { getToday } from '../utils.js';
import { LoginParams, LoginResponseBody, UserList, TherapyType } from '../types.js';

export const addKeyOfCookie = (cookie: string) => `PHPSESSID=${cookie}`;

export const loginRequest = async ({ id, password }: LoginParams) => {
  const URL = 'http://jinsul.co.kr/erp/login/alogin.php';
  const options: OptionsOfTextResponseBody | undefined = {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-requested-with': 'XMLHttpRequest',
    },
    form: {
      mode: 'login',
      GetId: id,
      GetPw: password,
    },
    responseType: 'text',
    throwHttpErrors: false,
    method: 'POST',
  };

  const response = await got(URL, options);
  if (response.statusCode !== 200) throw new Error('statusCode is not 200');

  const body: LoginResponseBody = JSON.parse(response.body.trim());

  if (body.result === 'fail') {
    throw new Error(`${body.msg}\nCause: ${JSON.stringify(body)}`);
  }
  const rawCookie = response.headers['set-cookie'];
  if (!rawCookie) {
    throw new Error(`cookie가 없습니다.\nCause: ${JSON.stringify(body)}`);
  }

  const cookie = rawCookie[0].split(';')[0].split('=')[1];
  return cookie;
};

export const getUserList = async (cookie: string): Promise<UserList> => {
  const URL = 'http://jinsul.co.kr/erp/physical/?p=15&mode=list&tp=m';
  const options: OptionsOfTextResponseBody | undefined = {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'ko',
      'upgrade-insecure-requests': '1',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      Referer: URL,
      cookie: addKeyOfCookie(cookie),
    },
    method: 'GET',
  };

  const response = await got(URL, options);
  if (response.statusCode !== 200) throw new Error('statusCode is not 200');

  const root = parse(response.body);

  const peerBlock = root.querySelectorAll('.peer span');
  const loginUserName = peerBlock
    .filter((el) => el.text.includes('물리치료사'))[0]
    ?.text.replace('(물리치료사)', '');
    
  if (!loginUserName) throw new Error('Cannot find login user name');

  const userList = root.querySelectorAll('#wuser_value2 option');

  const users = userList.map((option) => {
    const key = option.attributes.value;
    const name = option.text;
    return { key, name };
  });
  if (userList.length < 1) throw new Error('치료사 정보가 없다.');

  const loginUser = {
    key: users.find((user) => user.name === loginUserName)?.key || '',
    name: loginUserName,
  };
  if (!loginUser.key)
    throw new Error('getUserList()에서 loginUserKey를 찾을 수 없다.');

  return { users, loginUser };
};

export const getPatientListAndPrices = async (
  cookie: string,
  userList: UserList,
  type: TherapyType
) => {
  const userKey = userList.loginUser.key;

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
      cookie: addKeyOfCookie(cookie),
    },
    method: 'GET',
  };

  const response = await got(URL, options);
  if (response.statusCode !== 200) throw new Error('statusCode is not 200');

  const root = parse(response.body);
  const patientListEl = root.querySelectorAll('#patient_num option');
  const pricesEl = root.querySelectorAll('[name="phy_price"] option');

  // 환자를 "<환자번호> - <환자이름>" 형태로 반환한다.
  const patients = patientListEl.map((option) => {
    const text = option.text.trim();
    const [chartNumber, name] = text.split(' - ');
    return {
      chartNumber: chartNumber || text, // Fallback to full text if split fails
      name: name || '',
      originalText: text
    };
  });
  const prices = pricesEl.map((option) => option.attributes['value']);

  if (patients.length < 1) throw new Error('등록된 환자가 없다.');
  if (prices.length < 1) throw new Error('등록된 가격이 없다.');

  return { patients, prices };
};

export const loginAndScrape = async (id: string, password: string, type: TherapyType) => {
    const cookie = await loginRequest({ id, password });
    const userList = await getUserList(cookie);
    const patientListAndPrices = await getPatientListAndPrices(cookie, userList, type);
    return { cookie, userList, patientListAndPrices };
}
