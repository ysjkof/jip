import { describe, it, vi, expect, afterEach } from 'vitest';
import { printSavedInfo } from '../../../src/cli/output';
import { TherapyType } from '../../../src/enum';
import { SaveParams } from '../../../src/types/common.type';

describe('output 함수 테스트', () => {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

  afterEach(() => {
    spy.mockReset();
  });

  it('printSavedInfo는 콘솔에 정해진 형태의 문자열을 출력한다. (도수치료, 예약안함)', () => {
    const date = '20230101';
    const patient = '111 - 일일일';
    const param: SaveParams = {
      patientNum: 111,
      therapist: '김치료',
      date,
      price: 5000,
      patientType: '신환',
      isReserved: false,
    };
    const output = `${new Date()}\n  날짜: ${date} / 치료사: ${
      param.therapist
    } / 환자: ${patient} / 도수치료 / 가격: 5,000 / 신환 / 예약안함`;
    printSavedInfo(
      TherapyType.Dosu,
      { patients: ['000 - 공공공', patient], prices: ['5000', '10000'] },
      param
    );

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenLastCalledWith(output);
  });

  it('printSavedInfo는 콘솔에 정해진 형태의 문자열을 출력한다. (체외충격파, 예약함)', () => {
    const date = '20230101';
    const patient = '111 - 일일일';
    const param: SaveParams = {
      patientNum: 111,
      therapist: '김치료',
      date,
      price: 5000,
      patientType: '신환',
      isReserved: true,
    };
    const output = `${new Date()}\n  날짜: ${date} / 치료사: ${
      param.therapist
    } / 환자: ${patient} / 체외충격파 / 가격: 5,000 / 신환 / 예약함`;

    printSavedInfo(
      TherapyType.Eswt,
      { patients: ['000 - 공공공', patient], prices: ['5000', '10000'] },
      param
    );

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenLastCalledWith(output);
  });
});
