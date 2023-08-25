import { Response } from 'got';
import { LINE } from '../constant.js';
import { SaveParams, THERAPY_TYPE } from '../types/common.type.js';
import { patientListAndPrices } from '../index.js';

export const printLine = () => console.log(`${LINE}`);
export const printLineBreak = () => console.log('\n');
export const printFailSaveLogin = () => console.log('🚨 로그인 정보 저장실패');
export const printNotExistCmd = () =>
  console.log(
    console.log('\n🚨 없는 커맨드를 입력했습니다. 도움말을 확인하세요.')
  );
export const printSuccessSaveLogin = () =>
  console.log('✅ 로그인 정보 저장완료');
export const printSuccessLogout = () => console.log('✅ 로그아웃 성공.');
export const printSaveDataResult = (res: Response<string>) =>
  console.log(`\n✋ ${res.statusMessage}(${res.statusCode}): ${res.body}`);

export const printSavedInfo = (
  therapyType: THERAPY_TYPE,
  { patientNum, therapist, date, price, patientType, isReserved }: SaveParams
) => {
  if (!patientListAndPrices)
    throw new Error('printSavedInfo: 환자 정보가 없습니다.');

  const { patients } = patientListAndPrices;

  let therapy;
  let patient;
  if (!therapy && therapyType === 'dosu') therapy = '도수치료';
  if (!therapy && therapyType === 'eswt') therapy = '체외충격파';
  patients.some((_patient) => {
    const [_patientNum] = _patient.split(' - ');
    if (_patientNum === '' + patientNum) {
      patient = _patient;
      return true;
    }
  });

  const _price = new Intl.NumberFormat('ko-KR').format(price);
  const reservationState = isReserved ? '함' : '안함';
  console.log(
    `날짜: ${date} / 치료사: ${therapist} / 환자: ${patient} / ${therapy} / 가격: ${_price} / ${patientType} / 예약${reservationState}`
  );
};
