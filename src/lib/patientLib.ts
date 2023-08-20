import { inputYesOrNo } from '../cli/inputYesOrNo.js';

export const isNewPatient = async () => {
  return await inputYesOrNo({
    message: '신규환자를 등록합니까?',
  });
};
