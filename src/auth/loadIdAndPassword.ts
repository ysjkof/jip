import fs from 'fs';
import { ID_AND_PASSWORD_PATH } from '../constant.js';
import { LoginParams } from '../types/common.type.js';

export const loadIdAndPassword = (): LoginParams | false => {
  try {
    const idAndPassword = fs.readFileSync(ID_AND_PASSWORD_PATH, 'utf8');

    return idAndPassword.trim().length === 0
      ? false
      : JSON.parse(idAndPassword);
  } catch (error) {
    return false;
  }
};
