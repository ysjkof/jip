import fs from 'fs';
import { ID_AND_PASSWORD_PATH } from '../constant.js';
import { printSuccessLogout } from '../cli/output.js';

export const logout = () => {
  fs.writeFileSync(ID_AND_PASSWORD_PATH, '');
  printSuccessLogout();
};
