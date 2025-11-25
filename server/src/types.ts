export interface LoginParams {
  id?: string;
  password?: string;
}

export interface LoginResponseBody {
  result: string;
  msg: string;
}

export interface User {
  key: string;
  name: string;
}

export interface UserList {
  users: User[];
  loginUser: User;
}

export type TherapyType = 'dosu' | 'eswt';
