export function parseJSON(json: string, defaultValue?: any) {
  try {
    return JSON.parse(json || '{}');
  } catch (e) {
    return defaultValue || {};
  }
}
