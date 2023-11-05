import got from 'got';
import { ORIGIN } from './index.js';
import { createQueryStringFromObject } from '../lib/httpRequestLib.js';

interface GetListProps {
  startDate: string;
  endDate: string;
  therapyType: 'm' | 'e';
  userKey?: string | number;
}

export const getList = async (
  cookie: string,
  { startDate, endDate, therapyType, userKey = 0 }: GetListProps
) => {
  const queryObj = {
    p: '15', // 병원 번호로 예상됨
    mode: 'list',
    tp: therapyType, // therapy의 tp
    s: startDate,
    e: endDate,
    pk: userKey, // 전체일 경우 0, 특정 사용자만 쿼리할 경우 userKey
  };

  const queryString = createQueryStringFromObject(queryObj);
  const URL = `${ORIGIN}?${queryString}`;

  const response = await got(URL, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'ko',
      'upgrade-insecure-requests': '1',
      Referer: URL,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      cookie,
    },
    method: 'GET',
  });

  if (response.statusCode !== 200) throw new Error('statusCode is not 200');

  return response.body;
};
