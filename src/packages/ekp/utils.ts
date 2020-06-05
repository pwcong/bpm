import config from './config';

export function checkMessage(
  e: MessageEvent,
  system: string,
  moduleName: string,
  method: string,
  callback: (message) => void
) {
  const message = e.data || {};

  if (
    message.system !== system ||
    message.moduleName !== moduleName ||
    message.method !== method
  ) {
    return;
  }

  return callback(message);
}

export function getMessage(
  e: MessageEvent,
  method: string,
  callback: (message) => void
) {
  checkMessage(e, config.system, config.moduleName, method, callback);
}
