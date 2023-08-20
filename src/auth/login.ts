import { inputLoginParams } from '../cli/inputLoginParams.js';
import { addKeyOfCookie } from '../lib/authLib.js';
import { loadIdAndPassword } from './loadIdAndPassword.js';
import { loginRequest } from '../httpRequest/loginRequest.js';
import { saveIdAndPassword } from './saveIdAndPassword.js';

export const login = async () => {
  try {
    let idAndPassword = loadIdAndPassword();
    if (!idAndPassword) {
      idAndPassword = await inputLoginParams();
      saveIdAndPassword(idAndPassword);
    }

    const rawCookie = await loginRequest(idAndPassword);
    return addKeyOfCookie(rawCookie);
  } catch (error: Error | any) {
    const msg = error['message'];
    if (msg === '아이디가 없거나 비밀번호가 일치하지 않습니다.') {
      console.warn(
        `🚨 ${msg}\n🚨 아래 명령어로 로그인 정보를 저장하세요.\n🚨 login [ID] [Password]\n`
      );
      return undefined;
    }
    console.log('🚨', error['cause']);
    return undefined;
  }
};
