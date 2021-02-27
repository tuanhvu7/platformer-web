/**
 * @return val if it is defined; defaultVal if val is undefined
 */
export function handleDefaultValue<T>(val: T | undefined, defaultVal: T): T {
  return val !== undefined ? val : defaultVal;
}

/**
 * @return if typeof val is number
 */
export function isNumber(val: any): boolean {
  return typeof val === 'number';
}
