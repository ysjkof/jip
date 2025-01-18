import type { PatientListAndPrices } from '../types/common.type.js';

export const validatePrice = (
  price: PatientListAndPrices['prices'][0],
  prices: PatientListAndPrices['prices']
) => {
  const isRightPrice = prices.some((_price) => _price === price);
  if (!isRightPrice) {
    throw new Error('등록되지 않은 가격입니다.');
  }
  return true;
};
