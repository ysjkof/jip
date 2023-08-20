import fs from 'fs';
import { ID_AND_PASSWORD_PATH } from '../constant.js';
import { printSuccessLogout } from '../cli/output.js';

export const logout = () => {
  fs.unlink(ID_AND_PASSWORD_PATH, (err) => {
    if (err) {
      console.error('로그아웃 중 문제 발생.', err);
      return;
    }
    printSuccessLogout();
  });
};
