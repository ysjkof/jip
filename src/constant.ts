import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ID_AND_PASSWORD_PATH = `${__dirname}/secret`;
export const LINE =
  '-----------------------------------------------------------';
