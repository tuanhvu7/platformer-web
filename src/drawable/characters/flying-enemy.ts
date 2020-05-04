import { Enemy } from "./enemy";
import { Constants } from "../../const/constants";
import { platformer } from '../../platformer';

/**
 * flying enemy
 */
export class FlyingEnemy extends Enemy {

  // top y position this.pos.y can be at before vertical movement direction change
  private readonly topYLimit: number;

  // bottom y position this.pos.y can be at before vertical movement direction change
  private readonly bottomYLimit: number;

  // false means this goes through horizontal boundaries
  private readonly isAffectedByHorizontalBoundaries: boolean;

  // false means this goes through vertical boundaries
  private readonly isAffectedByVerticalBoundaries: boolean;

  /**
   * set properties of this;
   * set upper and lower Y limits to boundaries of level
   */
  constructor(x: number, y: number, diameter: number,
              horizontalVel: number, verticalVel: number,
              isAffectedByHorizontalBoundaries: boolean, isAffectedByVerticalBoundaries: boolean,
              isInvulnerable: boolean, isVisible: boolean, isActive: boolean) {
      super(x, y, diameter, horizontalVel, isInvulnerable, isVisible, isActive);

      this.fillColor = Constants.ENEMY_COLOR;

      this.topYLimit = Constants.SCREEN_HEIGHT - platformer.getCurrentActiveLevelHeight() + this.diameter / 2;
      this.bottomYLimit = Constants.SCREEN_HEIGHT - this.diameter / 2;

      this.vel.x = horizontalVel;
      this.vel.y = verticalVel;

      this.isAffectedByHorizontalBoundaries = isAffectedByHorizontalBoundaries;
      this.isAffectedByVerticalBoundaries = isAffectedByVerticalBoundaries;

      this.isVisible = isVisible;
  }

  /**
   * set properties of this;
   * set topYLimit and bottomYLimit to given values;
   */
  // constructor(int x, int y, int diameter,
  //                    float horizontalVel, float verticalVel,
  //                    int topYLimit, int bottomYLimit,
  //                    boolean isAffectedByHorizontalBoundaries, boolean isAffectedByVerticalBoundaries,
  //                    boolean isInvulnerable, boolean isVisible, boolean isActive) {
  //     super(x, y, diameter, horizontalVel, isInvulnerable, isVisible, isActive);

  //     this.fillColor = Constants.ENEMY_COLOR;

  //     this.topYLimit = topYLimit;
  //     this.bottomYLimit = bottomYLimit;

  //     this.vel.x = horizontalVel;
  //     this.vel.y = verticalVel;

  //     this.isAffectedByHorizontalBoundaries = isAffectedByHorizontalBoundaries;
  //     this.isAffectedByVerticalBoundaries = isAffectedByVerticalBoundaries;

  //     this.isVisible = isVisible;
  // }

  /**
   * handle movement (position, velocity)
   */
  handleMovement(): void {
      const shouldReverseFromTopLimit = this.pos.y <= this.topYLimit && this.vel.y < 0;
      const shouldReverseFromBottomLimit = this.pos.y >= this.bottomYLimit && this.vel.y > 0;
      if (shouldReverseFromTopLimit || shouldReverseFromBottomLimit) {
          this.vel.y = -this.vel.y;
      }
      this.pos.add(this.vel);
  }

  /**
   * handle contact with horizontal boundary
   */
  public handleContactWithHorizontalBoundary(boundaryYPoint: number, isFloorBoundary: boolean): void {
      if (this.isAffectedByHorizontalBoundaries) {
          this.vel.y = -this.vel.y;
      }
  }

  /**
   * handle contact with vertical boundary
   */
  public handleContactWithVerticalBoundary(boundaryXPoint: number): void {
      if (this.isAffectedByVerticalBoundaries) {
          const movingIntoBoundaryFromRight = this.pos.x > boundaryXPoint && this.vel.x < 0;
          const movingIntoBoundaryFromLeft = this.pos.x < boundaryXPoint && this.vel.x > 0;
          if (movingIntoBoundaryFromRight || movingIntoBoundaryFromLeft) {
              this.vel.x = -this.vel.x; // move in opposite horizontal direction
          }
      }
  }
}