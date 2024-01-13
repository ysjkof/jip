import fs from 'fs';
import { ID_AND_PASSWORD_PATH } from '../constant.js';
import { printSuccessLogout } from '../cli/output.js';
import { removeIdAtConfig } from '../config/index.js';

export const logout = () => {
  fs.writeFileSync(ID_AND_PASSWORD_PATH, '');
  removeIdAtConfig();
  printSuccessLogout();
};
