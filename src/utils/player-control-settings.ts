/**
 * player control key bindings
 */
export class PlayerControlSettings {
  // default player controls
  private static PLAYER_UP: string = 'w';
  private static PLAYER_DOWN: string = 's';
  private static PLAYER_LEFT: string = 'a';
  private static PLAYER_RIGHT: string = 'd';

  /**
   * make this class "static"
   */
  private constructor() {}


  /*** getters and setters ***/
  public static getPlayerUp(): string {
    return PlayerControlSettings.PLAYER_UP;
  }

  /**
   * set player up control to given key if give key is available
   */
  public static setPlayerUp(playerUp: string): void {
    if (PlayerControlSettings.isKeyAvailable(playerUp)) {
      PlayerControlSettings.PLAYER_UP = playerUp;
    }
  }

  public static getPlayerDown(): string {
    return PlayerControlSettings.PLAYER_DOWN;
  }

  /**
   * set player down control to given key if give key is available
   */
  public static setPlayerDown(playerDown: string): void {
    if (PlayerControlSettings.isKeyAvailable(playerDown)) {
      PlayerControlSettings.PLAYER_DOWN = playerDown;
    }
  }

  public static getPlayerLeft(): string {
    return PlayerControlSettings.PLAYER_LEFT;
  }

  /**
   * set player left control to given key if give key is available
   */
  public static setPlayerLeft(playerLeft: string): void {
    if (PlayerControlSettings.isKeyAvailable(playerLeft)) {
      PlayerControlSettings.PLAYER_LEFT = playerLeft;
    }
  }

  public static getPlayerRight(): string {
    return PlayerControlSettings.PLAYER_RIGHT;
  }

  /**
   * set player right control to given key if give key is available
   */
  public static setPlayerRight(playerRight: string): void {
    if (PlayerControlSettings.isKeyAvailable(playerRight)) {
      PlayerControlSettings.PLAYER_RIGHT = playerRight;
    }
  }


  /**
   * @return true if given key is available (not used)
   */
  public static isKeyAvailable(key: string): boolean {
    return PlayerControlSettings.getPlayerUp() != key &&
      PlayerControlSettings.getPlayerLeft() != key &&
      PlayerControlSettings.getPlayerDown() != key &&
      PlayerControlSettings.getPlayerRight() != key;
  }
}