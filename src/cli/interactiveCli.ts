import { Command } from 'commander';
import { loginAndLoadUsersAndPatients } from '../index.js';
import { initInteractiveUI } from '../interactiveUi/index.js';
import { isInitInteractiveUI } from '../prompts/yesOrNoPrompts.js';

export const interactiveCli = () => {
  const interactiveCli = new Command()
    .command('interactive')
    .description('대화형 인터페이스를 시작한다.')
    .action(async (_, command) => {
      if (command.args.length) return;
      if (await isInitInteractiveUI()) {
        await loginAndLoadUsersAndPatients();
        initInteractiveUI();
      }
    });
  return interactiveCli;
};
