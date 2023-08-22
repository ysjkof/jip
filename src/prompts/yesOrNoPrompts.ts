import prompts from 'prompts';
import { printLineBreak } from '../cli/output.js';

export const yesOrNoPrompts = async ({
  message,
  initial = 1,
}: {
  message: string;
  initial?: number;
}) => {
  const questions: prompts.PromptObject<string> = {
    type: 'select',
    name: 'yesOrNo',
    message,
    initial,
    choices: [
      { title: '네', value: true },
      { title: '아니오', value: false },
    ],
  };

  const response = await prompts(questions);
  return response.yesOrNo;
};

export const isContinueInput = async () => {
  return await yesOrNoPrompts({
    message: '계속 입력하시겠습니까?',
  });
};

export const isInitInteractiveUI = async () => {
  printLineBreak();
  return await yesOrNoPrompts({
    message: '대화형 인터페이스를 시작합니까?',
  });
};

export const isNewPatient = async () => {
  return await yesOrNoPrompts({
    message: '신규환자를 등록합니까?',
  });
};
