export function capitalize(str: unknown) {
  const strValue = String(str);
  return strValue.charAt(0).toUpperCase() + strValue.slice(1);
}
