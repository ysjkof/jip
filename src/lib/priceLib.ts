import { isOnlyNumber } from './commonLib.js';

export const matchPriceDigit = (priceString: string) => {
  if (!isOnlyNumber(priceString))
    throw new Error('가격은 숫자만 입력할 수 있다.');

  if (priceString.length > 3) return priceString;
  return priceString + '000';
};
