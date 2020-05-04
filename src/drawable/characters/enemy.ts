import { ACharacter } from "./character.abstract";
import { Constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { mainSketch } from '../../main';
import { ResourceUtils } from "../../utils/resource-utils";

/**
 * enemy
 */
export class Enemy extends ACharacter {

  // true means invulnerable; always kills player on contact
  private readonly isInvulnerable: boolean;

  isVisible: boolean;

  /**
   * set properties of this
   */
  constructor(x: number, y: number, diameter: number, horizontalVel: number,
    isInvulnerable: boolean, isVisible: boolean, isActive: boolean) {
    super(x, y, diameter, isActive);

    this.fillColor = Constants.ENEMY_COLOR;

    this.vel.x = horizontalVel;

    this.isInvulnerable = isInvulnerable;
    this.isVisible = isVisible;
  }

  /**
   * runs continuously. handles enemy movement and physics
   */
  public draw(): void {
    this.checkHandleOffscreenDeath();

    if (platformer.getCurrentActivePlayer() != null) {
      this.checkHandleContactWithPlayer();
    }
    this.handleMovement();

    if (this.isVisible) {
      this.show();
    }
  }

  /**
   * draw circle character
   */
  show(): void {
    if (this.isInvulnerable) {
      mainSketch.fill(
        mainSketch.random(0, 255),
        mainSketch.random(0, 255),
        mainSketch.random(0, 255));
    } else {
      mainSketch.fill(this.fillColor);
    }
    mainSketch.strokeWeight(0);
    mainSketch.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
  }

  /**
   * check and handle contact with player
   */
  private checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();
    if (curPlayer.isCanHaveContactWithEnemies()) { // to prevent multiple consecutive deaths and damage
      const collisionAngle = this.collisionWithPlayer();
      if (collisionAngle >= 0) {
        if (this.radianToDegrees(collisionAngle) >= Constants.MIN_PLAYER_KILL_ENEMY_COLLISION_ANGLE &&
          this.pos.y > curPlayer.getPos().y &&
          !this.isInvulnerable) // player is above this
        {
          this.handleDeath(false);

        } else {
          this.isVisible = true;
          curPlayer.changeHealth(-1);
        }
      }
    }
  }

  /**
   * return angle of collision between this and player;
   * range of collision angles (in degrees): [0, 90]
   * negative angle means no collision
   */
  private collisionWithPlayer(): number {
    const curPlayer = platformer.getCurrentActivePlayer();
    const xDifference = Math.abs(this.pos.x - curPlayer.getPos().x);
    const yDifference = Math.abs(this.pos.y - curPlayer.getPos().y);

    // distance between player and this must be sum of their radii for collision
    const distanceNeededForCollision = (this.diameter / 2) + (curPlayer.getDiameter() / 2);

    // pythagorean theorem
    const isAtCollisionDistance =
      Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2)) <= distanceNeededForCollision;

    if (isAtCollisionDistance) {
      return Math.atan2(yDifference, xDifference);
    } else {
      return -1.0;
    }
  }

  /**
   * handle movement (position, velocity)
   */
  handleMovement(): void {
    this.handleInAirPhysics();
    this.pos.add(this.vel);
  }

  /**
   * handle death
   */
  handleDeath(isOffscreenDeath: boolean): void {
    this.makeNotActive();
    platformer.getCurrentActiveLevelDrawableCollection().removeDrawable(this);
    if (!isOffscreenDeath) {
      ResourceUtils.playSong(ESongType.PLAYER_ACTION);
      platformer.getCurrentActivePlayer().handleJumpKillEnemyPhysics();
    }
  }
  
  private radianToDegrees(radianAngle: number): number {
    return radianAngle * (180 / Math.PI);
  }

}