import { login } from '../auth/login.js';
import { getUserList } from '../httpRequest/getUserList.js';
import { getPatientListAndPrices } from '../httpRequest/getPatientListAndPrices.js';
import { TherapyType } from '../enum.js';

export const addKeyOfCookie = (cookie: string) => `PHPSESSID=${cookie}`;

export const loginAndLoadUsersAndPatientsAndPrices = async (
  type: TherapyType
) => {
  const cookie = await login();
  const userList = await getUserList(cookie);
  const patientListAndPrices = await getPatientListAndPrices(
    cookie,
    userList,
    type
  );

  return { patientListAndPrices, userList, cookie };
};
