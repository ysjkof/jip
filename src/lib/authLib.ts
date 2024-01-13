import { getCookie } from '../auth/index.js';
import { getUserList, getPatientListAndPrices } from '../httpRequest/index.js';
import { TherapyType } from '../enum.js';

export const addKeyOfCookie = (cookie: string) => `PHPSESSID=${cookie}`;

export const loginAndLoadUsersAndPatientsAndPrices = async (
  type: TherapyType
) => {
  const cookie = await getCookie();
  const userList = await getUserList(cookie);
  const patientListAndPrices = await getPatientListAndPrices(
    cookie,
    userList,
    type
  );

  return { patientListAndPrices, userList, cookie };
};
