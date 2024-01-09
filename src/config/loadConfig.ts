// config.js
import fs from 'fs';
import { CONFIG_PATH } from '../constant.js';
import { ConfigValue } from '../types/common.type.js';

export const loadConfig = async (): Promise<ConfigValue> => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return { defaultTherapist: '' };

    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data) as ConfigValue;
  } catch (error) {
    console.error('Error reading config file:', error);
    process.exit(1);
  }
};
