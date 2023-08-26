import { Response } from 'got';
import { LINE } from '../constant.js';
import { TherapyType } from '../enum.js';
import type { PatientListAndPrices, SaveParams } from '../types/common.type.js';

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

function getTherapyName(therapyType: TherapyType) {
  switch (therapyType) {
    case TherapyType.Dosu:
      return '도수치료';
    case TherapyType.Eswt:
      return '체외충격파';
    default:
      return null;
  }
}

function findPatient(
  patientNum: number,
  patients: PatientListAndPrices['patients']
) {
  return patients.find((patient) => {
    const [_patientNum] = patient.split(' - ');
    return _patientNum === '' + patientNum;
  });
}

export const printSavedInfo = (
  therapyType: TherapyType,
  patientListAndPrices: PatientListAndPrices,
  { patientNum, therapist, date, price, patientType, isReserved }: SaveParams
) => {
  const { patients } = patientListAndPrices;

  const therapy = getTherapyName(therapyType);
  const patient = findPatient(patientNum, patients);
  const _price = new Intl.NumberFormat('ko-KR').format(price);
  const reservationState = isReserved ? '함' : '안함';

  console.log(
    `날짜: ${date} / 치료사: ${therapist} / 환자: ${patient} / ${therapy} / 가격: ${_price} / ${patientType} / 예약${reservationState}`
  );
};
