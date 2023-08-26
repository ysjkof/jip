import { TherapyType } from '../enum.js';
import { saveDosu, saveEswt } from '../httpRequest/index.js';
import {
  saveParamsPrompts,
  therapyPrompts,
  isContinueInput,
} from '../prompts/index.js';
import type { PatientListAndPrices, UserList } from '../types/common.type.js';

export const initInteractiveUI = async (
  cookie: string,
  userList: UserList,
  patientListAndPrices: PatientListAndPrices,
  therapy: TherapyType
) => {
  // if (await isNewPatient()) {
  //   // 신규 환자 등록
  // }
  const saveParams = await saveParamsPrompts(
    therapy,
    userList,
    patientListAndPrices
  );

  const saveTherapy = getSaveFn(therapy);
  await saveTherapy(saveParams, cookie, userList);

  if (await isContinueInput()) {
    const _therapy = await therapyPrompts();
    initInteractiveUI(cookie, userList, patientListAndPrices, _therapy);
  }
};

function getSaveFn(therapyType: TherapyType) {
  switch (therapyType) {
    case TherapyType.Dosu:
      return saveDosu;
    case TherapyType.Eswt:
      return saveEswt;
    default:
      throw new Error('기능이 없다');
  }
}
