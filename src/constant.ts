import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ID_AND_PASSWORD_PATH = `${__dirname}/secret`;
export const LINE =
  '-----------------------------------------------------------';

export const ORIGIN = 'http://jinsul.co.kr/erp/physical/';
export const SAVE_URL = `${ORIGIN}controller.php`;

export const DOSU_INCEN = 10;
export const ESWT_INCEN = 5;
