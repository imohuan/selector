import { isBoolean, isNumber, isEmpty } from "lodash-es";

export function isNullOrEmpty(data: any): boolean {
  if (isBoolean(data)) return !data;
  else if (isNumber(data)) return data === 0;
  else return isEmpty(data);
}
