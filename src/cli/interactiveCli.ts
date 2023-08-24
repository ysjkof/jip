import { Command } from 'commander';
import { loginAndLoadUsersAndPatientsAndPrices } from '../index.js';
import { initInteractiveUI } from '../interactiveUi/index.js';
import { isInitInteractiveUI } from '../prompts/yesOrNoPrompts.js';
import { therapyPrompts } from '../prompts/therapyPrompts.js';

export const interactiveCli = () => {
  const interactiveCli = new Command()
    .command('interactive')
    .description('대화형 인터페이스를 시작한다.')
    .action(async (_, command) => {
      if (command.args.length) return;
      if (await isInitInteractiveUI()) {
        const therapy = await therapyPrompts();
        await loginAndLoadUsersAndPatientsAndPrices(therapy);
        initInteractiveUI();
      }
    });
  return interactiveCli;
};
