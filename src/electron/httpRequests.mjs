// Electron HTTP request functions - self-contained

import got from 'got';
import querystring from 'querystring';
import { parse } from 'node-html-parser';

// Constants
const ORIGIN = 'http://jinsul.co.kr/erp/physical/';
const SAVE_URL = `${ORIGIN}controller.php`;
const DOSU_INCEN = 10;
const ESWT_INCEN = 5;

// Helper functions
const createQueryStringFromObject = (obj) => querystring.stringify(obj);

const toKorDateFromString = (dateStr) => {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}년 ${month}월 ${day}일`;
};

// Login function
export const loginRequest = async ({ id, password }) => {
  const URL = 'http://jinsul.co.kr/erp/login/alogin.php';
  const options = {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-requested-with': 'XMLHttpRequest',
    },
    form: {
      mode: 'login',
      GetId: id,
      GetPw: password,
    },
    responseType: 'text',
    throwHttpErrors: false,
    method: 'POST',
  };

  const response = await got(URL, options);
  if (response.statusCode !== 200) throw new Error('statusCode is not 200');

  const body = JSON.parse(response.body.trim());

  if (body.result === 'fail') {
    throw new Error(`${body.msg}\nCause: ${body}`);
  }
  const rawCookie = response.headers['set-cookie'];
  if (!rawCookie) {
    throw new Error(`cookie가 없습니다.\nCause: ${body}`);
  }

  const cookie = rawCookie[0].split(';')[0]; // Keep key=value format
  return cookie;
};

// Save data functions
const saveData = async (
  params,
  cookie,
  userList,
  phy_type,
  phy_incen,
  pageId = 15
) => {
  const mode = 'add';
  const { date, therapist, patientNum, patientType, price, isReserved, targetAreas } = params;

  const userKey = userList?.users?.find((user) => user.name === therapist)?.key;
  if (!userKey) throw new Error('saveData()에서 userKey를 찾지 못했다.');

  const headers = {
    accept: 'text/plain, */*; q=0.01',
    'accept-language': 'ko-KR',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-with': 'XMLHttpRequest',
    Referer: `${ORIGIN}?p=${pageId}&mode=${mode}&tp=${phy_type}&u=${userKey}&w=${date}`,
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    cookie,
  };

  const bodyProps = {
    mode,
    phy_type,
    phy_ukey: userKey,
    phy_date: date,
    d: toKorDateFromString(date),
    a: '보정탑정형외과의원',
    b: therapist,
    room_num: 1,
    phy_incen,
    incen_check: 'Y',
    incen_check: 'Y',
    patient_num: patientNum,
    patient_type: patientType,
    appoint_yn: isReserved ? 'Y' : 'N',
    replace_price: undefined,
    replace_memo: undefined,
  };

  // Add ESWT specific fields
  if (phy_type === 'e') {
    Object.assign(bodyProps, {
      'treat_type[]': phy_type,
      discount_price: 0,
      memo: '',
      'target_area[]': targetAreas,
    });
    // phy_price is NOT sent for ESWT based on curl request
  } else {
    // Dosu specific fields (or common fields that ESWT doesn't use)
    Object.assign(bodyProps, {
      phy_price: price,
    });
  }
  const body = createQueryStringFromObject(bodyProps);

  const response = await got(SAVE_URL, {
    headers,
    body,
    method: 'POST',
  });
  
  console.log('Save response:', response.statusCode, response.body);
  
  if (response.body.includes('<meta http-equiv="refresh"')) {
    throw new Error('Session invalid or expired. Please login again.');
  }

  if (response.body.toLowerCase().includes('fail') || response.body.toLowerCase().includes('error')) {
    throw new Error(`Server returned error: ${response.body}`);
  }

  return response;
};

export const saveDosu = async (params, cookie, userList) => {
  return saveData(params, cookie, userList, 'm', DOSU_INCEN, 15);
};

export const saveEswt = async (params, cookie, userList) => {
  return saveData(params, cookie, userList, 'e', ESWT_INCEN, 16);
};

// Get user list function
export const getUserList = async (cookie, date) => {
  const URL = `${ORIGIN}?p=15&mode=list&tp=m&s=${date}&e=${date}&pk=0`;
  
  const response = await got(URL, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'ko',
      'upgrade-insecure-requests': '1',
      Referer: URL,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      cookie,
    },
    method: 'GET',
  });

  if (response.statusCode !== 200) throw new Error('statusCode is not 200');
  return response.body;
};

// Fetch data from server
export const fetchDataFromServer = async (apiKey) => {
  const URL = 'http://localhost:3000/data';
  
  const response = await got(URL, {
    headers: {
      'X-API-Key': apiKey,
    },
    method: 'GET',
    responseType: 'json'
  });

  if (response.statusCode !== 200) throw new Error('Failed to fetch data from server');
  return response.body;
};

// Get history function
export const getHistory = async (cookie, date, type = 'dosu') => {
  const tp = type === 'eswt' ? 'e' : 'm';
  const p = type === 'eswt' ? 16 : 15;
  const URL = `${ORIGIN}?p=${p}&mode=list&tp=${tp}&s=${date}&e=${date}&pk=0`;
  
  const response = await got(URL, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'ko',
      'upgrade-insecure-requests': '1',
      Referer: URL,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      cookie,
    },
    method: 'GET',
  });

  if (response.statusCode !== 200) throw new Error('statusCode is not 200');
  
  // Parse HTML
  const root = parse(response.body);
  const tables = root.querySelectorAll('table');
  
  // Find the relevant table (usually the one that is not toggletable and has content)
  // Based on historyLib.ts, we look for tables that are not .toggletable
  // And we extract data.
  
  const historyData = [];
  
  tables.forEach(table => {
    if (table.classList.contains('toggletable')) return;
    
    // Check if it's the main list table (heuristic: has many rows or specific headers)
    // For now, let's extract all non-toggle tables
    
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      const rowData = [];
      cells.forEach(cell => {
        rowData.push(cell.textContent.trim());
      });
      if (rowData.length > 0) {
        historyData.push(rowData);
      }
    });
  });

  return historyData;
};
