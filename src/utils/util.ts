import { QuerySearchParamsDto } from '../dtos/paginate.dto';

export const LOG_LEVEL_DEBUG = 3;
export const LOG_LEVEL_INFO = 2;
export const LOG_LEVEL_WARN = 1;
export const LOG_LEVEL_ERROR = 0;
export const LOG_LEVEL = parseInt(process.env.WALLET_TRACKER_LOG_LEVEL as string) || 0;

export function logError(...values: any) {
  if (LOG_LEVEL < LOG_LEVEL_ERROR) {
    return;
  }
  console.error(...values);
}

export function logWarn(...values: any) {
  if (LOG_LEVEL < LOG_LEVEL_WARN) {
    return;
  }
  console.warn(...values);
}

export function logInfo(...values: any) {
  if (LOG_LEVEL < LOG_LEVEL_INFO) {
    return;
  }
  console.info(...values);
}

export function logDebug(...values: any) {
  if (LOG_LEVEL < LOG_LEVEL_DEBUG) {
    return;
  }
  console.debug(...values);
}

// parseJSON tries to parse a string into a JSON
// it returns null if the string is an invalid JSON
export function parseJSON(value: any): any {
  let res: any;
  try {
    res = JSON.parse(value);
  } catch (err) {
    res = null;
  }
  return res;
}

// parseJSONStringArray tries to parse a string into a JSON
// array of strings. It returns null if the string is not a
// JSON Array of strings
export function parseJSONStringArray(value: any): string[] | null {
  const res = parseJSON(value);
  if (!res) return null;
  if (!Array.isArray(res)) return null;
  const resArray = res as any[];
  if (!resArray.every(v => typeof v === 'string')) return null;
  const resStringArray = resArray as string[];
  return resStringArray;
}

export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export function formatPaginate(query: QuerySearchParamsDto): QuerySearchParamsDto {
  const defaultLimit = 10;
  let order = 'desc';
  if (typeof query.order === 'string' && query.order.toLowerCase() === 'asc')
    order = 'asc';
  let limit = Number(query.limit) || defaultLimit;
  if (limit > 100) {
    limit = 100;
  }

  const offset = Number(query.offset) || 0;
  return { limit, offset, order };
}

export async function sleep(millis: number) {
  return new Promise(r => setTimeout(r, millis));
}

export function limitTo(value: number, limit: number): number {
  return value > limit ? limit : value;
}

export function isABooleanValue(value: unknown): boolean {
  const booleanStringRegex = new RegExp(/true|false/, 'i');
  return (
    typeof value === 'boolean' ||
    (typeof value === 'string' && booleanStringRegex.test(value))
  );
}

export function convertStringToLiteralBoolean(str: string): boolean | string {
  switch (str) {
    case 'true':
      return true;

    case 'false':
      return false;

    default:
      return str;
  }
}

export function checkOrder(str: unknown): string | false {
  if (typeof str !== 'string') return false;
  return /asc|desc/i.test(str) ? str.toLocaleUpperCase() : false;
}
