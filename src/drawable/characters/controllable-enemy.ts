import { IKeyControllable } from "../key-controllable.interface";
import { platformer } from '../../platformer';
import { mainSketch } from "../../main";
import { constants } from "../../const/constants";
import { Enemy } from "./enemy";
import { PlayerControlSettings } from "../../utils/player-control-settings";
import { IControllableEnemyProps } from './character-prop.interfaces';

/**
 * controllable enemy
 */
export class ControllableEnemy extends Enemy implements IKeyControllable {

  // true means left and right button controls affect this
  private readonly isHorizontalControllable: boolean;
  private moveLeftPressed: boolean;
  private moveRightPressed: boolean;


  // true means jump button controls affect this
  private readonly isJumpControllable: boolean;
  private jumpPressed: boolean;

  private ableToMoveRight: boolean;
  private ableToMoveLeft: boolean;

  private readonly horizontalMoveSpeed: number;

  /**
   * set properties of this;
   * horizontalVel is vel of this if this.isHorizontalControllable is false
   */
  constructor(controllableCharacterProps: IControllableEnemyProps) {
    super(controllableCharacterProps);
    this.isJumpControllable = controllableCharacterProps.isJumpControllable;
    this.jumpPressed = false;

    this.isHorizontalControllable = controllableCharacterProps.isHorizontalControllable;
    this.moveLeftPressed = false;
    this.moveRightPressed = false;

    this.ableToMoveRight = true;
    this.ableToMoveLeft = true;

    // used for left and right control
    this.horizontalMoveSpeed = Math.abs(controllableCharacterProps.horizontalVel);
  }


  /**
   * active and add this to game
   */
  public makeActive(): void {
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
    platformer.addToAllKeyControllables(this); // connect this keyEvent() from main keyEvent()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
    platformer.deleteFromAllKeyControllables(this); // disconnect this keyEvent() from main keyEvent()
  }

  /**
   * handle movement (position, velocity)
   */
  handleMovement(): void {
    this.handleVerticalMovement();
    // this is NOT controllable horizontally when level is finished
    if (!platformer.getCurrentActiveLevel().isHandlingLevelComplete()) {
      this.handleHorizontalMovement();
    }
    this.pos.add(this.vel);
  }


  /**
   * handle contact with vertical boundary
   */
  public handleContactWithVerticalBoundary(boundaryXPoint: number) {
    if (this.isHorizontalControllable) {
      this.vel.x = 0;
      if (this.pos.x > boundaryXPoint) { // left boundary
        this.ableToMoveLeft = false;
        this.pos.x = boundaryXPoint + this.diameter / 2;
      } else { // right boundary
        this.ableToMoveRight = false;
        this.pos.x = boundaryXPoint - this.diameter / 2;
      }

    } else {
      super.handleContactWithVerticalBoundary(boundaryXPoint);
    }
  }

  /**
   * handle character keypress controls
   */
  public keyPressed(): void {
    const lowerCaseKey = mainSketch.key.toLowerCase();
    if (PlayerControlSettings.getPlayerLeft() === lowerCaseKey) { //left
      this.moveLeftPressed = true;
    }
    if (PlayerControlSettings.getPlayerRight() === lowerCaseKey) { //right
      this.moveRightPressed = true;
    }
    if (PlayerControlSettings.getPlayerUp() === lowerCaseKey) {
      this.jumpPressed = true;
    }
  }

  public keyReleased(): void {
    const lowerCaseKey = mainSketch.key.toLowerCase();
    if (PlayerControlSettings.getPlayerLeft() === lowerCaseKey) { //left
      this.moveLeftPressed = false;
    }
    if (PlayerControlSettings.getPlayerRight() === lowerCaseKey) { //right
      this.moveRightPressed = false;
    }
    if (PlayerControlSettings.getPlayerUp() === lowerCaseKey) {
      this.jumpPressed = false;
    }
  }

  private handleVerticalMovement(): void {
    if (this.isJumpControllable && this.jumpPressed) { // jump button pressed/held
      if (this.numberOfFloorBoundaryContacts > 0) { // able to jump
        this.vel.y = constants.CHARACTER_JUMP_VERTICAL_VELOCITY;
      } else {
        // for jumping higher the longer jump button is held
        this.vel.y = Math.min(
          this.vel.y + constants.GRAVITY.y * constants.VARIABLE_JUMP_GRAVITY_MULTIPLIER,
          constants.MAX_VERTICAL_VELOCITY);
      }

    } else if (this.numberOfFloorBoundaryContacts === 0) { // in air
      this.handleInAirPhysics();
    }
  }

  private handleHorizontalMovement(): void {
    if (this.isHorizontalControllable) {
      if (this.moveLeftPressed && this.ableToMoveLeft) {
        this.vel.x = -this.horizontalMoveSpeed;
      }
      if (this.moveRightPressed && this.ableToMoveRight) {
        this.vel.x = this.horizontalMoveSpeed;
      }
      if (!this.moveLeftPressed && !this.moveRightPressed) {
        this.vel.x = 0;
      }

    }
  }

  /*** getters and setters ***/
  public setAbleToMoveRight(ableToMoveRight: boolean): void {
    this.ableToMoveRight = ableToMoveRight;
  }

  public setAbleToMoveLeft(ableToMoveLeft: boolean): void {
    this.ableToMoveLeft = ableToMoveLeft;
  }
}