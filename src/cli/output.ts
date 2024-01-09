import { Response } from 'got';
import { LINE } from '../constant.js';
import { TherapyType } from '../enum.js';
import type {
  ConfigValue,
  PatientListAndPrices,
  PrintResult,
  SaveParams,
} from '../types/common.type.js';

export const printLine = () => console.info(`${LINE}`);
export const printLineBreak = () => console.info('\n');
export const printFailSaveLogin = () => console.info('🚨 로그인 정보 저장실패');
export const printNotExistCmd = () =>
  console.info(
    console.info('\n🚨 없는 커맨드를 입력했습니다. 도움말을 확인하세요.')
  );
export const printSuccessSaveLogin = () =>
  console.info('✅ 로그인 정보 저장완료');
export const printSuccessLogout = () => console.info('✅ 로그아웃 성공.');
export const printSaveDataResult = (res: Response<string>) =>
  console.info(`✋ ${res.statusMessage}(${res.statusCode}): ${res.body}`);

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

  console.info(
    `${new Date()}\n  날짜: ${date} / 치료사: ${therapist} / 환자: ${patient} / ${therapy} / 가격: ${_price} / ${patientType} / 예약${reservationState}`
  );
};

export const printHistoryPeriod = ({
  startDate,
  endDate,
  userName = '전체',
}: PrintResult) => {
  console.info(
    `  ✅ 조회기간: ${startDate} ~ ${endDate}\n  ✅ 조회대상: ${userName}`
  );
};

export const printSavedConfig = (config: ConfigValue) =>
  console.info('기본 값\n', config);

export const printFinishSaveConfig = () =>
  console.info('✅ 기본 값 설정 저장 완료');
