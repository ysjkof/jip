import { loginPrompts } from '../prompts/index.js';
import { addKeyOfCookie } from '../lib/authLib.js';
import { loginRequest } from '../httpRequest/index.js';
import { loadIdAndPassword, saveIdAndPassword } from './index.js';

export const getCookie = async () => {
  try {
    let idAndPassword = loadIdAndPassword();
    if (!idAndPassword) {
      idAndPassword = await loginPrompts();
      saveIdAndPassword(idAndPassword);
    }

    const rawCookie = await loginRequest(idAndPassword);
    return addKeyOfCookie(rawCookie);
  } catch (error: Error | any) {
    const msg = error['message'];
    let errMsg = '🚨';
    if (msg === '아이디가 없거나 비밀번호가 일치하지 않습니다.') {
      errMsg = `🚨 ${msg}\n🚨 아래 명령어로 로그인 정보를 저장하세요.\n🚨 login [ID] [Password]\n`;
    }
    throw new Error(`${errMsg}\nCause: ${error['cause']}`);
  }
};
