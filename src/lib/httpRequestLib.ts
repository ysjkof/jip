import querystring from 'querystring';

export const createQueryStringFromObject = (obj: {
  [key: string]: string | number | any;
}) => querystring.stringify(obj);
