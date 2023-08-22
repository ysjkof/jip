import prompts from 'prompts';
import type { LoginParams } from '../types/common.type.js';

export async function loginPrompts(): Promise<LoginParams> {
  const questions: prompts.PromptObject<string>[] = [
    {
      type: 'text',
      name: 'id',
      message: `로그인 아이디(ID)`,
    },
    {
      type: 'password',
      name: 'password',
      message: '비밀번호',
    },
  ];
  const response = await prompts(questions);
  const id = response.id;
  const password = response.password;
  if (!id || !password) throw new Error('id or password is empty');
  return { id, password };
}
