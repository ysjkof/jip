import got, { OptionsOfTextResponseBody } from 'got';
import { parse } from 'node-html-parser';
import { cookie } from '../index.js';
import type { UserList } from '../types/common.type.js';

export const getUserList = async (): Promise<UserList | null> => {
  if (!cookie) return null;
  const URL = 'http://jinsul.co.kr/erp/physical/?p=15&mode=list&tp=m';
  const options: OptionsOfTextResponseBody | undefined = {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'ko',
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

  const peerBlock = root.querySelectorAll('.peer span');
  const loginUserName = peerBlock
    .filter((el) => el.text.includes('물리치료사'))[0]
    .text.replace('(물리치료사)', '');
  const userList = root.querySelectorAll('#wuser_value2 option');

  const users = userList.map((option) => {
    const key = option.attributes.value;
    const name = option.text;
    return { key, name };
  });
  const loginUser = {
    key: users.find((user) => user.name === loginUserName)?.key || '',
    name: loginUserName,
  };

  if (!loginUser.key)
    throw new Error('getUserList()에서 loginUserKey를 찾을 수 없다.');

  return { users, loginUser };
};
