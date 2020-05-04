import { mainSketch } from '../main';

/**
 * constants used across app
 */
export class Constants {

  /*** level panel config ***/
  public static readonly TEXT_SIZE = 24;
  public static readonly PANEL_SIZE = 200;
  public static readonly DEFAULT_PANEL_COLOR = 0x00FF00;
  public static readonly ALTERNATE_PANEL_COLOR = 0xFFDAB9;

  // widths of all levels
  public static readonly LEVELS_WIDTH_ARRAY = [
      0,          // non-existent level zero
      8750,
      12000,
      8500
  ];

  // heights of all levels
  public static readonly LEVELS_HEIGHT_ARRAY = [
      0,      // non-existent level zero
      900,    // level one
      1300,
      900
  ];

  /*** screen config ***/
  public static readonly SCREEN_HEIGHT = 900;
  public static readonly SCREEN_WIDTH = 1000;
  public static readonly LEVEL_FLOOR_Y_POSITION = Constants.SCREEN_HEIGHT - 100;
  /*
   * lower and upper boundary of viewbox;
   * viewbox will move to follow player if player goes past this screen size boundary
   * Example: 0.25 means viewbox follow player if player goes past upper and lower 25% screen size
   */
  public static readonly HORIZONTAL_VIEWBOX_BOUNDARY = 0.35;
  public static readonly VERTICAL_VIEWBOX_BOUNDARY = 0.1;


  /*** velocity and acceleration physics ***/
  public static readonly GRAVITY = mainSketch.createVector(0, 0.4);
  // gravity multiplier for jumping higher when holding jump button
  public static readonly WALL_SLIDE_ACCELERATION = mainSketch.createVector(0, 0.1);
  public static readonly CHARACTER_JUMP_VERTICAL_VELOCITY = -12;
  public static readonly VARIABLE_JUMP_GRAVITY_MULTIPLIER = 0.55;
  public static readonly EVENT_BLOCK_DESCENT_VERTICAL_VELOCITY = 1.5;
  public static readonly MAX_VERTICAL_VELOCITY = 15;

  /*** Event config ***/
  public static readonly CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY = -27;
  // launch vertical velocity after warping to desired location
  public static readonly CHARACTER_WARP_EVENT_VERTICAL_VELOCITY = -10;

  /*** player config ***/
  public static readonly PLAYER_MOVEMENT_SPEED = 3;
  public static readonly PLAYER_LEVEL_COMPLETE_SPEED = 1;
  public static readonly PLAYER_JUMP_KILL_ENEMY_HOP_VERTICAL_VELOCITY = -7;
  public static readonly PLAYER_DEFAULT_COLOR = 0x000000;
  public static readonly PLAYER_DAMAGED_COLOR = 0x888888;
  public static readonly PLAYER_DIAMETER = 60;
  public static readonly PLAYER_HEALTH_TEXT_COLOR = 0xFFFFFF;
  // minimum angle (degrees) of collision between player and enemy
  // for player to kill enemy
  public static readonly MIN_PLAYER_KILL_ENEMY_COLLISION_ANGLE = 20.0;

  /*** enemy config **/
  public static readonly ENEMY_SLOW_MOVEMENT_SPEED = 1;
  public static readonly ENEMY_REGULAR_MOVEMENT_SPEED = 2.5;
  public static readonly ENEMY_FAST_MOVEMENT_SPEED = 5;
  public static readonly ENEMY_COLOR = 0xFF0000;
  public static readonly SMALL_ENEMY_DIAMETER = 60;
  public static readonly MEDIUM_ENEMY_DIAMETER = 250;
  public static readonly BIG_ENEMY_DIAMETER = 500;


  /*** boundary and block config ***/
  public static readonly BOUNDARY_COLOR = 0x000000;
  public static readonly DEFAULT_BOUNDARY_LINE_THICKNESS = 1;

  public static readonly BREAKABLE_BLOCK_COLOR = 0x800000;
  public static readonly DEFAULT_BLOCK_COLOR = 0xCD853F;
  public static readonly DEFAULT_BLOCK_SIZE = 100;

  public static readonly ITEM_BLOCK_TEXT_COLOR = 0x000000;

  public static readonly EVENT_BLOCK_COLOR = 0x00E500;
  public static readonly DEFAULT_EVENT_BLOCK_WIDTH = 125;
  public static readonly DEFAULT_EVENT_BLOCK_HEIGHT = 200;

  /*** collectable config ***/
  public static readonly CHECKPOINT_COLOR = 0xFFD700;
  public static readonly CHECKPOINT_WIDTH = 40;
  public static readonly CHECKPOINT_HEIGHT = 100;

  public static readonly LEVEL_GOAL_COLOR = 0xDCDCDC;
  public static readonly LEVEL_GOAL_WIDTH = 40;
  public static readonly LEVEL_GOAL_HEIGHT = Constants.LEVEL_FLOOR_Y_POSITION;

  public static readonly HEALTH_ITEM_COLOR = 0xDCDCDC;
  public static readonly NEGATIVE_HEALTH_ITEM_TEXT_COLOR = 0xFF0000;
  public static readonly ZERO_HEALTH_ITEM_TEXT_COLOR = 0x888888;
  public static readonly POSITIVE_HEALTH_ITEM_TEXT_COLOR = 0x008000;
  public static readonly HEALTH_ITEM_SIZE = 60;

  /**
   * make this class "static"
   */
  private constructor() {
  }

}
