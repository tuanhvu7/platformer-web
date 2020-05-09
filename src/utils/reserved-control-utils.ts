import { EReservedControlKeys } from "../enums/reserved-control-keys.enum";

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
