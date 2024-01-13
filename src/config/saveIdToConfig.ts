import { ConfigValue, LoginParams } from '../types/common.type.js';
import { loadConfig } from './loadConfig.js';
import { saveConfig } from './saveConfig.js';

export const saveIdToConfig = async (loginId: LoginParams['id']) => {
  try {
    const prevConfig = await loadConfig();
    const option: ConfigValue = { ...prevConfig, loginId };
    saveConfig(option);
    return true;
  } catch (error) {
    return false;
  }
};
