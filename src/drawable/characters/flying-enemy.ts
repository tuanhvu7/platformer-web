import { Enemy } from "./enemy";
import { constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { IFlyingEnemyProps } from './character-prop.interfaces';
import { handleDefaultValue, isNumber } from '../../utils/ccommon-utils';

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
   * set topYLimit and bottomYLimit to given values;
   * if null or undefined is given for topYLimit and bottomYLimit,
   * then they shall be set to upper and lower Y limits to boundaries of level
   */
  constructor(flyingEnemyProps: IFlyingEnemyProps) {
    super(flyingEnemyProps);

    this.fillColor = constants.ENEMY_COLOR;

    const topAndBotYProvided = isNumber(flyingEnemyProps.topYLimit) && isNumber(flyingEnemyProps.bottomYLimit);
    if (topAndBotYProvided) {
      this.topYLimit = flyingEnemyProps.topYLimit as number;
      this.bottomYLimit = flyingEnemyProps.bottomYLimit as number;
    } else {  // falsy non-zero topYLimit and bottomYLimit are given
      this.topYLimit = constants.SCREEN_HEIGHT - platformer.getCurrentActiveLevelHeight() + this.diameter / 2;
      this.bottomYLimit = constants.SCREEN_HEIGHT - this.diameter / 2;
    }

    this.vel.x = flyingEnemyProps.horizontalVel;
    this.vel.y = flyingEnemyProps.verticalVel;

    this.isAffectedByHorizontalBoundaries = flyingEnemyProps.isAffectedByHorizontalBoundaries;
    this.isAffectedByVerticalBoundaries = flyingEnemyProps.isAffectedByVerticalBoundaries;

    this.isVisible = handleDefaultValue(flyingEnemyProps.isVisible, true);
  }

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