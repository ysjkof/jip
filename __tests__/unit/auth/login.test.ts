import { describe, afterEach, it, vi, expect } from 'vitest';
import * as auth from '../../../src/auth/index';
import * as prompts from '../../../src/prompts';
import * as req from '../../../src/httpRequest';
import * as authLib from '../../../src/lib/authLib';

vi.mock('../../../src/auth/saveIdAndPassword', () => ({
  saveIdAndPassword: vi.fn(),
}));
vi.mock('../../../src/auth/loadIdAndPassword', () => ({
  loadIdAndPassword: vi.fn(),
}));
vi.mock('../../../src/prompts', () => ({ loginPrompts: vi.fn() }));
vi.mock('../../../src/httpRequest', () => ({
  loginRequest: vi.fn(),
}));
vi.mock('../../../src/lib/authLib', () => ({
  addKeyOfCookie: vi.fn(),
}));

const idAndPassword = { id: '_user', password: '_password' };

describe('login 함수 테스트', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loadIdAndPassword가 반환하는 값이 없을 때 loginPrompts와 saveIdAndPassword를 호출해야 합니다.', async () => {
    vi.spyOn(auth, 'loadIdAndPassword').mockReturnValue(false);

    await auth.login();

    expect(auth.loadIdAndPassword).toHaveBeenCalled();
    expect(prompts.loginPrompts).toHaveBeenCalled();
    expect(auth.saveIdAndPassword).toHaveBeenCalled();
  });

  it('loadIdAndPassword가 반환하는 값이 있을 때 loginRequest와 addKeyOfCookie를 호출해야 합니다.', async () => {
    vi.spyOn(auth, 'loadIdAndPassword').mockReturnValue(idAndPassword);
    const rawCookie = 'rawCookieData';
    vi.spyOn(req, 'loginRequest').mockReturnValue(Promise.resolve(rawCookie));

    await auth.login();

    expect(auth.loadIdAndPassword).toHaveBeenCalled();
    expect(prompts.loginPrompts).not.toHaveBeenCalled();
    expect(auth.saveIdAndPassword).not.toHaveBeenCalled();
    expect(req.loginRequest).toHaveBeenCalledWith(idAndPassword);
    expect(authLib.addKeyOfCookie).toHaveBeenCalledWith(rawCookie);
  });

  it('에러 발생 시 적절한 에러 메시지를 던져야 합니다.', async () => {
    const errorMessage = '아이디가 없거나 비밀번호가 일치하지 않습니다.';
    const errorCause = new Error('원인 오류');
    vi.spyOn(auth, 'loadIdAndPassword').mockReturnValue(false);
    vi.spyOn(prompts, 'loginPrompts').mockRejectedValue({
      message: errorMessage,
      cause: errorCause,
    });

    await expect(auth.login()).rejects.toThrow(errorMessage);

    expect(auth.loadIdAndPassword).toHaveBeenCalled();
    expect(prompts.loginPrompts).toHaveBeenCalled();
    expect(auth.saveIdAndPassword).not.toHaveBeenCalled();
  });
});
