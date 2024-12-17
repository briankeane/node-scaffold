export function isValidJSONString(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (err) {
    return false;
  }
}
