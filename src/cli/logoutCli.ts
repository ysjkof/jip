import { Command } from 'commander';
import { logout } from '../auth/logout.js';

export const logoutCli = () => {
  const _logout = new Command()
    .command('logout')
    .description('저장된 ID와 비밀번호 제거합니다.')
    .action(() => {
      logout();
    });
  return _logout;
};
