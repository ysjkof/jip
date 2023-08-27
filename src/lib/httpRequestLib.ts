import querystring from 'querystring';
import type { CreateBodyPropsInput } from '../types/common.type.js';

export const createQueryStringFromObject = (obj: {
  [key: string]: string | number;
}) => querystring.stringify(obj);

export const createBody = (props: CreateBodyPropsInput) => {
  return createQueryStringFromObject(createBodyObj(props));
};

const createBodyObj = (props: CreateBodyPropsInput) => {
  const phy_date = props.phy_date;
  const year = phy_date.substring(0, 4);
  const month = phy_date.substring(4, 6);
  const day = phy_date.substring(6, 8);
  const d = `${year}년 ${month}월 ${day}일`;

  return { ...props, d };
};
