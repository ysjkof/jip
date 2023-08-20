import prompts from 'prompts';
import { printLineBreak } from './output.js';

export const inputYesOrNo = async ({
  message,
  initial = 1,
}: {
  message: string;
  initial?: number;
}) => {
  const questions: prompts.PromptObject<string>[] = [
    {
      type: 'select',
      name: 'yesOrNo',
      message,
      initial,
      choices: [
        { title: '네', value: true },
        { title: '아니오', value: false },
      ],
    },
  ];
  const response = await prompts(questions);
  return response.yesOrNo;
};

export const isContinueInput = async () => {
  return await inputYesOrNo({
    message: '계속 입력하시겠습니까?',
  });
};

export const isInitInteractiveUI = async () => {
  printLineBreak();
  return await inputYesOrNo({
    message: '대화형 인터페이스를 시작합니까?',
  });
};
