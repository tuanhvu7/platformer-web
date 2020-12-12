import { IDrawable } from "../drawable.interface";
import { Vector } from "p5";
import { mainSketch } from '../../main';
import { platformer } from '../../platformer';
import { constants } from "../../const/constants";

/**
 * viewbox that keeps track of screen position to display character;
 * to be used in translate(x, y) in level's draw()
 */
export class ViewBox implements IDrawable {

  // top-left (x, y) coordinates of viewbox position
  private readonly pos: Vector;

  // velocity of viewbox
  private readonly vel: Vector;

  /**
   * set properties of this
   */
  constructor(startXPos: number, startYPos: number, initAsActive: boolean) {
    this.pos = mainSketch.createVector(startXPos, startYPos);
    this.vel = mainSketch.createVector(0, 0);
    if (initAsActive) {
      this.makeActive();
    }
  }

  /**
   * runs continuously. handles viewbox position
   */
  public draw(): void {
    if (platformer.getCurrentActivePlayer()) {
      this.handleHorizontalMovement();
      this.handleVerticalMovement();
    }
  }

  /**
   * activate and add this to game
   */
  private makeActive(): void {
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
  }

  /**
   * set given value to be middle x position of this;
   * set this x position to be at start or end of level this is in if
   * given value would result this x position level overflow
   */
  public setViewBoxHorizontalPosition(middleXPos: number): void {
    if (middleXPos - mainSketch.width / 2 < 0) {
      this.pos.x = 0;
    } else if (middleXPos + mainSketch.width / 2 > platformer.getCurrentActiveLevelWidth()) {
      this.pos.x = platformer.getCurrentActiveLevelWidth() - constants.SCREEN_WIDTH;
    } else {
      this.pos.x = middleXPos - (constants.SCREEN_WIDTH / 2);
    }
  }

  /**
   * handle horizontal movement
   */
  private handleHorizontalMovement(): void {
    const player = platformer.getCurrentActivePlayer();
    if (!player) return;

    if (platformer.getCurrentActiveLevel().isHandlingLevelComplete() && this.playerAtHorizontalViewBoxBoundary(false)) { // viewbox movement during level completion
      this.vel.x = constants.PLAYER_LEVEL_COMPLETE_SPEED;

    } else {
      if (player.isMoveLeftPressed()) {
        if (this.pos.x > 0 // left edge of viewbox not at left edge of level
          &&
          this.playerAtHorizontalViewBoxBoundary(true)) {
          this.vel.x = -constants.PLAYER_MOVEMENT_SPEED;
        } else {
          this.vel.x = 0;
        }
      }
      if (player.isMoveRightPressed()) {
        if (this.pos.x < platformer.getCurrentActiveLevelWidth() - mainSketch.width // right edge of viewbox not at right edge of level
          &&
          this.playerAtHorizontalViewBoxBoundary(false)) {
          this.vel.x = constants.PLAYER_MOVEMENT_SPEED;
        } else {
          this.vel.x = 0;
        }
      }
      if (!player.isMoveLeftPressed() &&
        !player.isMoveRightPressed()) {
        this.vel.x = 0;
      }
    }

    this.pos.add(this.vel.x, 0);

    // fix viewbox level boundary overflows
    if (this.pos.x > platformer.getCurrentActiveLevelWidth() - mainSketch.width) {
      this.pos.x = platformer.getCurrentActiveLevelWidth() - mainSketch.width;
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
    }
  }

  /**
   * handle vertical movement
   */
  private handleVerticalMovement(): void {
    const player = platformer.getCurrentActivePlayer();

    if (!player) return;

    const shouldScrollDown = this.playerAtVerticalViewBoxBoundary(true) &&
      player.getVel().y < 0;

    const shouldScrollUp = this.playerAtVerticalViewBoxBoundary(false) &&
      player.getVel().y > 0;
    if (shouldScrollDown || shouldScrollUp) {
      this.vel.y = player.getVel().y;
    } else {
      this.vel.y = 0;
    }

    this.pos.add(0, this.vel.y); // int cast to avoid frame rate drop

    // fix viewbox level boundary overflows
    const isPlayerAtGroundLevel
      = player.getPos().y + (constants.PLAYER_DIAMETER / 2) === constants.LEVEL_FLOOR_Y_POSITION;
    if (this.pos.y < mainSketch.height - platformer.getCurrentActiveLevelHeight()) { // top overflow
      this.pos.y = mainSketch.height - platformer.getCurrentActiveLevelHeight();
    } else if (this.pos.y > 0 || isPlayerAtGroundLevel) { // bottom overflow or player at ground level
      this.pos.y = 0;
    }
  }

  /**
   * return if player is at lower (left) or upper (right) boundary (depending from given value) of viewbox
   */
  private playerAtHorizontalViewBoxBoundary(isLowerLeftBoundary: boolean): boolean {
    const player = platformer.getCurrentActivePlayer();
    if (!player) return false;
    
    const playerXPos = player.getPos().x;
    if (isLowerLeftBoundary) {
      return playerXPos <= this.pos.x + constants.HORIZONTAL_VIEWBOX_BOUNDARY * mainSketch.width;
    } else {
      return playerXPos >= this.pos.x + (1.00 - constants.HORIZONTAL_VIEWBOX_BOUNDARY) * mainSketch.width;
    }
  }

  /**
   * return if player is at bottom or top boundary (depending on given value) of viewbox
   */
  private playerAtVerticalViewBoxBoundary(isBottomBoundary: boolean): boolean {
    const player = platformer.getCurrentActivePlayer();
    if (!player) return false;

    const playerYPos = player.getPos().y;
    if (isBottomBoundary) {
      return playerYPos <= this.pos.y + constants.VERTICAL_VIEWBOX_BOUNDARY * mainSketch.height;
    } else {
      return playerYPos >= this.pos.y + (1.00 - constants.VERTICAL_VIEWBOX_BOUNDARY) * mainSketch.height;
    }
  }

  /*** getters and setters ***/
  public getPos(): Vector {
    return this.pos;
  }
}