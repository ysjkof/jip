import got, { type OptionsOfTextResponseBody } from 'got';
import type { LoginParams, LoginResponseBody } from '../types/common.type.js';

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
    throw new Error(body.msg, { cause: body });
  }
  const rawCookie = response.headers['set-cookie'];
  if (!rawCookie) {
    throw new Error('cookie가 없습니다.', { cause: body });
  }

  const cookie = rawCookie[0].split(';')[0].split('=')[1];
  return cookie;
};
