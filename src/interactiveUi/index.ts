import { TherapyType } from '../enum.js';
import { saveDosu } from '../httpRequest/saveDosu.js';
import { saveEswt } from '../httpRequest/saveEswt.js';
import { saveParamsPrompts } from '../prompts/saveParamsPrompts.js';
import { therapyPrompts } from '../prompts/therapyPrompts.js';
import { isContinueInput } from '../prompts/yesOrNoPrompts.js';
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
