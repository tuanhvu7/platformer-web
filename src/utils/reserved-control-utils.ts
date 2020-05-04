/**
 * For handling reserved key controls
 */
export class ReservedControlUtils {
  /**
   * to make class 'static'
   */
  private constructor() {}

  /**
   * @return true if given keycode is reserved
   */
  public static isKeyCodeReserved(keyToTest: string): boolean {
    return keyToTest.toLowerCase() in EReservedControlKeys;
  }
}

/**
 * reserved control keys
 */
export enum EReservedControlKeys {
  c,  // used for toggle checkpoint
  u,  // used for configure player controls
  p   // used for game pause
}