import { isOnlyNumber } from './commonLib.js';
import type { DigitNumber } from '../types/common.type.js';

export const toKorDateFromString = (dateStr: string) => {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}년 ${month}월 ${day}일`;
};

export const getToday = (digit: DigitNumber) => {
  const year = digit === 6 ? '2-digit' : 'numeric';
  const sixDigit = new Date()
    .toLocaleDateString('ko-KR', {
      year,
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\ |\./g, '');
  return sixDigit;
};

export const getDateOrToday = (dateStr: string, digit: DigitNumber = 6) => {
  if (dateStr && !isValidDateFormat(dateStr))
    throw new Error('날짜는 년월일 8자, 6자나 월일 4자를 입력한다.');
  return dateStr || getToday(digit);
};

export const isValidDateFormat = (dateString: string): boolean => {
  if (
    dateString.length !== 4 &&
    dateString.length !== 6 &&
    dateString.length !== 8
  )
    return false;
  if (!isOnlyNumber(dateString)) return false;

  let year = '';
  let month = '';
  let day = '';
  if (dateString.length === 4) {
    year = new Date().getFullYear().toString().substring(2, 4);
    month = dateString.substring(0, 2);
    day = dateString.substring(2, 4);
  } else if (dateString.length === 6) {
    year = dateString.substring(0, 2);
    month = dateString.substring(2, 4);
    day = dateString.substring(4);
  } else if (dateString.length === 8) {
    year = dateString.substring(0, 4);
    month = dateString.substring(3, 6);
    day = dateString.substring(6);
  }

  if (+year < 0 || +year > 99 || +month < 1 || +month > 12 || +day < 1) {
    return false;
  }

  // daysInMonth[0]은 배열 인덱스 자릿수를 맞추기 위한 무의미한 값.
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (isLeapYear(+year, +month)) {
    // 윤년인 경우 2월의 일 수를 29일로 변경합니다.
    daysInMonth[2] = 29;
  }

  if (+day > daysInMonth[+month]) return false;
  return true;
};

const isLeapYear = (year: number, month: number) =>
  +month === 2 && ((+year % 4 === 0 && +year % 100 !== 0) || +year % 400 === 0);
