import { logInfo } from './util';

export const stream = {
  write: (message: string) => {
    logInfo(message.substring(0, message.lastIndexOf('\n')));
  },
};
