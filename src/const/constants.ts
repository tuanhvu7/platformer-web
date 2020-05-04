/**
 * app.constants used across app
 */
export const Constants = Object.freeze({

  /*** level panel config ***/
  TEXT_SIZE: 24,
  PANEL_SIZE: 200,
  DEFAULT_PANEL_COLOR: 0x00FF00,
  ALTERNATE_PANEL_COLOR: 0XFFDAB9,

  // widths of all levels
  LEVELS_WIDTH_ARRAY: [
    0,          // non-existent level zero
    8750,
    12000,
    8500
  ],

  // heights of all levels
  LEVELS_HEIGHT_ARRAY: [
    0,      // non-existent level zero
    900,    // level one
    1300,
    900
  ],

  /*** screen config ***/
  SCREEN_HEIGHT: 900,
  SCREEN_WIDTH: 1000,

  /*** enemy config **/
  ENEMY_SLOW_MOVEMENT_SPEED: 1,
  ENEMY_REGULAR_MOVEMENT_SPEED: 2.5,
  ENEMY_FAST_MOVEMENT_SPEED: 5,
  ENEMY_COLOR: 0xFF0000,
  SMALL_ENEMY_DIAMETER: 60,
  MEDIUM_ENEMY_DIAMETER: 250,
  BIG_ENEMY_DIAMETER: 500,
})
