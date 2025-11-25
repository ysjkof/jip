import { loginRequest, getUserList, getPatientListAndPrices } from './services/scraper.js';
import { logger } from './logger.js';
import got from 'got';
import { parse } from 'node-html-parser';
import { getToday } from './utils.js';

const debugScrape = async () => {
  const id = process.env.USER_ID;
  const password = process.env.USER_PASSWORD;

  if (!id || !password) {
    console.error('USER_ID and USER_PASSWORD must be set');
    return;
  }

  try {
    console.log('Logging in...');
    const cookie = await loginRequest({ id, password });
    console.log('Logged in. Cookie:', cookie);

    console.log('Fetching user list...');
    const userList = await getUserList(cookie);
    console.log('User list fetched.');

    const userKey = userList.loginUser.key;
    const therapyType = 'm'; // dosu
    const URL = `http://jinsul.co.kr/erp/physical/?p=15&mode=add&tp=${therapyType}&u=${userKey}&w=${getToday(8)}`;
    
    console.log(`Fetching URL: ${URL}`);
    const response = await got(URL, {
        headers: { cookie: `PHPSESSID=${cookie}` }
    });

    const root = parse(response.body);
    const patientOptions = root.querySelectorAll('#patient_num option');
    
    console.log(`Found ${patientOptions.length} patient options.`);
    if (patientOptions.length > 0) {
        console.log('First 5:', patientOptions.slice(0, 5).map(o => o.text.trim()));
        console.log('Last 5:', patientOptions.slice(-5).map(o => o.text.trim()));
    }

    // Check for pagination
    const links = root.querySelectorAll('a');
    console.log(`Found ${links.length} links.`);
    // links.forEach(l => console.log(l.getAttribute('href'), l.text));

  } catch (error) {
    console.error('Error:', error);
  }
};

debugScrape();
