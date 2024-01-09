import fs from 'fs';
import { CONFIG_PATH } from '../constant.js';
import { ConfigValue } from '../types/common.type.js';

export const saveConfig = (option: ConfigValue) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(option));
    return true;
  } catch (error) {
    return false;
  }
};
