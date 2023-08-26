import { isOnlyNumber } from './commonLib.js';
import type { PatientListAndPrices } from '../types/common.type.js';

export const equalizePriceOfDigits = (priceString: string) => {
  if (!isOnlyNumber(priceString))
    throw new Error('가격은 숫자만 입력할 수 있다.');

  if (priceString.length > 3) return priceString;
  return priceString + '000';
};

export const getPrice = (
  inputPrice: string,
  prices: PatientListAndPrices['prices']
) => {
  if (inputPrice && !prices.includes(inputPrice))
    throw new Error('등록되지 않은 가격입니다.');

  const price = inputPrice
    ? equalizePriceOfDigits(inputPrice)
    : prices.at(-1) || prices[0];

  return +price;
};
