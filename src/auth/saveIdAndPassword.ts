import fs from 'fs';
import { ID_AND_PASSWORD_PATH } from '../constant.js';
import { LoginParams } from '../types/common.type.js';

export const saveIdAndPassword = (idAndPassword: LoginParams) => {
  try {
    fs.writeFileSync(ID_AND_PASSWORD_PATH, JSON.stringify(idAndPassword));
    return true;
  } catch (error) {
    return false;
  }
};
