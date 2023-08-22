import { saveData } from '../httpRequest/saveData.js';
import { patientListAndPrices } from '../index.js';
import { saveParamsPrompts } from '../prompts/saveParamsPrompts.js';
import { isContinueInput } from '../prompts/yesOrNoPrompts.js';

export const receiveInputAndSave = async () => {
  if (!patientListAndPrices) return;
  const saveParams = await saveParamsPrompts();

  if (!saveParams) return;
  await saveData(saveParams);
};

export const initInteractiveUI = async () => {
  // if (await isNewPatient()) {
  //   // 신규 환자 등록
  // }
  await receiveInputAndSave();
  if (await isContinueInput()) initInteractiveUI();
};
