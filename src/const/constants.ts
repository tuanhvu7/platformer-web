import { mainSketch } from '../main';
import { Vector } from 'p5';

/**
 * constants used across app
 */
class Constants {

  /*** level panel config ***/
  public readonly TEXT_SIZE = 24;
  public readonly PANEL_SIZE = 200;
  public readonly DEFAULT_PANEL_COLOR = '#00FF00';
  public readonly ALTERNATE_PANEL_COLOR = '#FFDAB9';

  // widths of all levels
  public readonly LEVELS_WIDTH_ARRAY = [
      0,          // non-existent level zero
      8750,
      12000,
      // 8500
  ];

  // heights of all levels
  public readonly LEVELS_HEIGHT_ARRAY = [
      0,      // non-existent level zero
      900,    // level one
      1300,
      // 900
  ];

  /*** screen config ***/
  public readonly SCREEN_HEIGHT = 900;
  public readonly SCREEN_WIDTH = 1000;
  public readonly LEVEL_FLOOR_Y_POSITION = this.SCREEN_HEIGHT - 100;
  /*
   * lower and upper boundary of viewbox;
   * viewbox will move to follow player if player goes past this screen size boundary
   * Example: 0.25 means viewbox follow player if player goes past upper and lower 25% screen size
   */
  public readonly HORIZONTAL_VIEWBOX_BOUNDARY = 0.35;
  public readonly VERTICAL_VIEWBOX_BOUNDARY = 0.1;


  /*** velocity and acceleration physics ***/
  public readonly GRAVITY: Vector;
  // gravity multiplier for jumping higher when holding jump button
  public readonly WALL_SLIDE_ACCELERATION: Vector;
  public readonly CHARACTER_JUMP_VERTICAL_VELOCITY = -12;
  public readonly VARIABLE_JUMP_GRAVITY_MULTIPLIER = 0.55;
  public readonly EVENT_BLOCK_DESCENT_VERTICAL_VELOCITY = 1.5;
  public readonly MAX_VERTICAL_VELOCITY = 15;

  /*** Event config ***/
  public readonly CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY = -27;
  // launch vertical velocity after warping to desired location
  public readonly CHARACTER_WARP_EVENT_VERTICAL_VELOCITY = -10;

  /*** player config ***/
  public readonly PLAYER_MOVEMENT_SPEED = 3;
  public readonly PLAYER_LEVEL_COMPLETE_SPEED = 1;
  public readonly PLAYER_JUMP_KILL_ENEMY_HOP_VERTICAL_VELOCITY = -7;
  public readonly PLAYER_DEFAULT_COLOR = '#000000';
  public readonly PLAYER_DAMAGED_COLOR = '#888888';
  public readonly PLAYER_DIAMETER = 60;
  public readonly PLAYER_HEALTH_TEXT_COLOR = '#FFFFFF';
  // minimum angle (degrees) of collision between player and enemy
  // for player to kill enemy
  public readonly MIN_PLAYER_KILL_ENEMY_COLLISION_ANGLE = 20.0;

  /*** enemy config **/
  public readonly ENEMY_SLOW_MOVEMENT_SPEED = 1;
  public readonly ENEMY_REGULAR_MOVEMENT_SPEED = 2.5;
  public readonly ENEMY_FAST_MOVEMENT_SPEED = 5;
  public readonly ENEMY_COLOR = '#FF0000';
  public readonly SMALL_ENEMY_DIAMETER = 60;
  public readonly MEDIUM_ENEMY_DIAMETER = 250;
  public readonly BIG_ENEMY_DIAMETER = 500;


  /*** boundary and block config ***/
  public readonly BOUNDARY_COLOR = '#000000';
  public readonly DEFAULT_BOUNDARY_LINE_THICKNESS = 1;

  public readonly BREAKABLE_BLOCK_COLOR = '#800000';
  public readonly DEFAULT_BLOCK_COLOR = '#CD853F';
  public readonly DEFAULT_BLOCK_SIZE = 100;

  public readonly ITEM_BLOCK_TEXT_COLOR = '#000000';

  public readonly EVENT_BLOCK_COLOR = '#00E500';
  public readonly DEFAULT_EVENT_BLOCK_WIDTH = 125;
  public readonly DEFAULT_EVENT_BLOCK_HEIGHT = 200;

  /*** collectable config ***/
  public readonly CHECKPOINT_COLOR = '#FFD700';
  public readonly CHECKPOINT_WIDTH = 40;
  public readonly CHECKPOINT_HEIGHT = 100;

  public readonly LEVEL_GOAL_COLOR = '#DCDCDC';
  public readonly LEVEL_GOAL_WIDTH = 40;
  public readonly LEVEL_GOAL_HEIGHT = this.LEVEL_FLOOR_Y_POSITION;

  public readonly HEALTH_ITEM_COLOR = '#DCDCDC';
  public readonly NEGATIVE_HEALTH_ITEM_TEXT_COLOR = '#FF0000';
  public readonly ZERO_HEALTH_ITEM_TEXT_COLOR = '#888888';
  public readonly POSITIVE_HEALTH_ITEM_TEXT_COLOR = '#008000';
  public readonly HEALTH_ITEM_SIZE = 60;

  /**
   * To avoid undefined error mainSketch.createVector on app startup
   */
  public setVectorProperties(): void {
    (this.GRAVITY as any) = mainSketch.createVector(0, 0.4);
    (this.WALL_SLIDE_ACCELERATION as any) = mainSketch.createVector(0, 0.1);
  }
}

/**
 * For other classes to use constants
 */
export const constants = new Constants();
