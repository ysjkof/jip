import { Command } from 'commander';
import { loginPrompts } from '../prompts/index.js';
import { saveIdAndPassword } from '../auth/index.js';
import { printFailSaveLogin, printSuccessSaveLogin } from './output.js';
import { saveIdToConfig } from '../config/index.js';

export const loginCli = () => {
  const _login = new Command()
    .command('login')
    .description(
      'ID와 비밀번호를 저장한다. 비밀번호를 생략하면 ID를 비밀번호로 사용한다.'
    )
    .argument('[ID]', '아이디(ID)')
    .argument('[Password]', '비밀번호(Password)')
    .action(async (id, pw) => {
      let idAndPassword = { id, password: pw };
      if (!id) idAndPassword = await loginPrompts();
      else if (id && !pw) idAndPassword.password = id;

      const isSaved = saveIdAndPassword(idAndPassword);
      if (!isSaved) return printFailSaveLogin();
      saveIdToConfig(id);
      return printSuccessSaveLogin();
    });
  return _login;
};
