type MODE = 'add' | 'del';
export type PHY_TYPE = 'm' | 'e';
export type PATIENT_TYPE = '신환' | '재진' | '기타여부';
export type APPOINT_YN = 'Y' | 'N';

export type DigitNumber = 6 | 8;

export interface BodyProps {
  mode: MODE; // add || del
  phy_type: PHY_TYPE; // 충격파: e || 도수치료: m
  phy_ukey: string; // 모르지만 1150인듯
  phy_date: string; // 입력날짜 yyyymmdd
  d: string; // 입력날짜 yyyy년+mm월+dd일
  a: string; // 병원이름
  b: string; // 치료사 이름
  room_num: number;
  phy_incen: number; // 인센티브 퍼센트
  incen_check?: 'Y'; // 할인/대체 적용. 체크면 Y, 아니면 안보냄.
  patient_num: number; // 환자 번호
  patient_type: PATIENT_TYPE; // 신환, 재진, 기타여부
  phy_price: number; // 가격 40,000 | 80,000 | 130,000
  discount_price?: number; // 할인가격
  replace_price?: number; // 대체가격
  replace_memo?: string; // 비고
  appoint_yn: APPOINT_YN; // 예약여부
}

export interface SaveParams {
  date: BodyProps['phy_date'];
  therapist: BodyProps['b'];
  price: BodyProps['phy_price'];
  isReserved: boolean;
  patientNum: BodyProps['patient_num'];
  patientType: BodyProps['patient_type'];
  // userKey: BodyProps['phy_ukey'];
}

export interface LoginParams {
  id: string;
  password: string;
}

export interface User {
  key: string;
  name: string;
}

export interface UserList {
  users: User[];
  loginUser: User;
}

export interface LoginResponseBody {
  result: 'success' | 'fail';
  msg: string;
  url?: string;
}

export interface PatientListAndPrices {
  patients: string[];
  prices: string[];
}

export interface PrintResult {
  startDate: string;
  endDate: string;
  userName: string;
}
