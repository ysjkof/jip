import { UserList } from '../types/common.type.js';

export const isValidUser = (
  userName: UserList['loginUser']['name'],
  users: UserList['users']
) => {
  const existTherapist = users.some(({ name }) => name === userName);
  if (!existTherapist) {
    throw new Error('등록된 치료사가 아니야. 이름을 정확히 입력해.');
  }
  return true;
};
