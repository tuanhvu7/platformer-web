import { IDrawable } from "../drawable.interface";
import { Vector } from 'p5';
import { mainSketch } from "../../main";
import { Constants } from "../../const/constants";
import { platformer } from '../../platformer';

/**
 * Common for circular characters
 */
export abstract class ACharacter implements IDrawable {

  // (x, y) coordinates of center of character (x, y)
  readonly pos: Vector;
  // (x, y) velocity of character (x, y)
  vel: Vector;

  readonly diameter: number;

  fillColor: number;

  // number of floor-like boundaries this is touching;
  numberOfFloorBoundaryContacts: number;

  /**
   * set properties of this
   */
  constructor(x: number,
              y: number,
              diameter: number,
              isActive: boolean) {
    this.pos = mainSketch.createVector(x, y);
    this.vel = mainSketch.createVector();
    this.diameter = diameter;

    this.numberOfFloorBoundaryContacts = 0;

    if (isActive) {
      this.makeActive();
    }
  }

  abstract draw(): void;

  /**
   * draw circle character
   */
  show(): void {
    mainSketch.fill(this.fillColor);
    mainSketch.strokeWeight(0);
    mainSketch.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
  }

  /**
   * handle contact with horizontal boundary
   */
  public handleContactWithHorizontalBoundary(boundaryYPoint: number, isFloorBoundary: boolean): void {
    if (isFloorBoundary) { // floor-like boundary
      if (this.vel.y > 0) { // boundary only act like floor if this is falling onto boundary
        this.vel.y = 0;
        this.pos.y = boundaryYPoint - this.diameter / 2;
      }
    } else { // ceiling-like boundary
      if (this.vel.y < 0) { // boundary only act like ceiling if this is rising into boundary
        this.vel.y = 1;
        this.pos.y = boundaryYPoint + this.diameter / 2;
        this.pos.add(this.vel);
      }
    }
  }

  /**
   * handle contact with vertical boundary
   */
  public handleContactWithVerticalBoundary(boundaryXPoint: number): void {
    const movingIntoBoundaryFromRight = this.pos.x > boundaryXPoint && this.vel.x < 0;
    const movingIntoBoundaryFromLeft = this.pos.x < boundaryXPoint && this.vel.x > 0;
    if (movingIntoBoundaryFromRight || movingIntoBoundaryFromLeft) {
      this.vel.x = -this.vel.x; // move in opposite horizontal direction
    }
  }

  /**
   * handle movement (horizontal, vertical) of this
   */
  abstract handleMovement(): void;

  /**
   * handle arial physics
   */
  handleInAirPhysics(): void {
    this.vel.y = Math.min(this.vel.y + Constants.GRAVITY.y, Constants.MAX_VERTICAL_VELOCITY);
  }


  /**
   * active and add this to game
   */
  public makeActive(): void {
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
  }

  /**
   * @param amount change numberOfFloorBoundaryContacts by given value
   */
  public changeNumberOfFloorBoundaryContacts(amount: number): void {
    this.numberOfFloorBoundaryContacts += amount;
  }

  /**
   * check and handle death of this by going offscreen
   */
  checkHandleOffscreenDeath(): void {
    const upperScreenLimit = mainSketch.height - platformer.getCurrentActiveLevelHeight();

    if (this.pos.y + this.diameter / 2 <= upperScreenLimit ||
      this.pos.y - this.diameter / 2 >= mainSketch.height) {

      this.handleDeath(true);
    }
  }

  /**
   * handle death of this;
   * to override in extended methods
   */
  abstract handleDeath(isOffscreenDeath: boolean): void;

  /*** getters and setters ***/
  public getPos(): Vector {
    return this.pos;
  }

  public getVel(): Vector {
    return this.vel;
  }

  public setVel(vel: Vector): void {
    this.vel = vel;
  }

  public getDiameter(): number {
    return this.diameter;
  }
}