import { getPatientListAndPrices } from './getPatientListAndPrices.js';
import { getUserList } from './getUserList.js';
import { loginRequest } from './loginRequest.js';
import { saveDosu } from './saveDosu.js';
import { saveEswt } from './saveEswt.js';

const ORIGIN = 'http://jinsul.co.kr/erp/physical/';
const SAVE_URL = `${ORIGIN}controller.php`;

export {
  SAVE_URL,
  getPatientListAndPrices,
  getUserList,
  saveEswt,
  saveDosu,
  loginRequest,
};
