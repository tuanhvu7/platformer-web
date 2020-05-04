import { ACharacter } from "./character.abstract";
import { IKeyControllable } from "../key-controllable.interface";
import { EventBlockTopBoundary } from "../boundaries/event-block-top-boundary";
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { Constants } from "../../const/constants";
import { mainSketch } from "../../main";
import { platformer } from '../../platformer';
import * as p5 from 'p5';
import { ResourceUtils } from "../../utils/resource-utils";

/**
 * player controllable character in game
 */
public class Player extends ACharacter implements IKeyControllable {

  // health of this, 0 means dead
  private health: number;

  // true means this does interact with enemies
  private canHaveContactWithEnemies: boolean;

  // number of wall-like boundaries this is touching;
  private numberOfVerticalBoundaryContacts: number;

  // number of ceiling-like boundaries this is touching;
  private numberOfCeilingBoundaryContacts: number;

  // top boundary of event blocks that this is touching
  private readonly eventBlockTopBoundaryContacts: Set<EventBlockTopBoundary>;

  // stores floor boundary that this cannot contact with
  // to prevent going on floor boundaries when walking from below
  private previousFloorBoundaryContact: HorizontalBoundary;

  // true means should set previousFloorBoundaryContact
  // when this loses contact with floor boundary
  private shouldSetPreviousFloorBoundaryContact: boolean;

  // player pressed control states
  private moveLeftPressed: boolean;
  private moveRightPressed: boolean;
  private jumpPressed: boolean;

  private ableToMoveRight: boolean;
  private ableToMoveLeft: boolean;

  private isDescendingDownEventBlock: boolean;

  /**
   * set properties of this;
   * set this to have 1 health
   */
  constructor(x: number, y: number, diameter: number, isActive: boolean) {
    super(x, y, diameter, isActive);

    this.health = 1;
    this.canHaveContactWithEnemies = true;
    this.fillColor = Constants.PLAYER_DEFAULT_COLOR;

    this.numberOfVerticalBoundaryContacts = 0;
    this.numberOfFloorBoundaryContacts = 0;

    this.eventBlockTopBoundaryContacts = new Set();
    this.previousFloorBoundaryContact = null;
    this.shouldSetPreviousFloorBoundaryContact = true;

    this.resetControlPressed();

    this.isDescendingDownEventBlock = false;

    this.ableToMoveRight = true;
    this.ableToMoveLeft = true;
  }

  /**
   * set properties of this
   */
  // constructor(int x, int y, int diameter, int health, boolean isActive) {
  //   super(x, y, diameter, isActive);
  //   if (health < 1) {
  //     throw new IllegalArgumentException("Initial player health must be at least 1");
  //   }

  //   this.health = health;
  //   this.canHaveContactWithEnemies = true;
  //   this.fillColor = Constants.PLAYER_DEFAULT_COLOR;

  //   this.numberOfVerticalBoundaryContacts = 0;
  //   this.numberOfFloorBoundaryContacts = 0;

  //   this.eventBlockTopBoundaryContacts = Collections.newSetFromMap(new ConcurrentHashMap < > ());
  //   this.previousFloorBoundaryContact = null;
  //   this.shouldSetPreviousFloorBoundaryContact = true;

  //   this.resetControlPressed();

  //   this.isDescendingDownEventBlock = false;

  //   this.ableToMoveRight = true;
  //   this.ableToMoveLeft = true;
  // }

    /**
   * handle character keypress controls
   */
  public keyPressed(): void {
    const lowercaseKeyCode = String.fromCharCode(mainSketch.keyCode).toLowerCase();
    if (PlayerControlSettings.getPlayerLeft() == lowercaseKeyCode) { //left
      this.moveLeftPressed = true;
    }
    if (PlayerControlSettings.getPlayerRight() == lowercaseKeyCode) { //right
      this.moveRightPressed = true;
    }
    if (PlayerControlSettings.getPlayerUp() == lowercaseKeyCode) {
      this.jumpPressed = true;
    }
    if ((PlayerControlSettings.getPlayerDown() == lowercaseKeyCode) &&
      this.eventBlockTopBoundaryContacts.size == 1 && !this.isDescendingDownEventBlock) {
      this.isDescendingDownEventBlock = true;
    }
  }

  public keyReleased(): void {
    const lowercaseKeyCode = String.fromCharCode(mainSketch.keyCode).toLowerCase();
    if (PlayerControlSettings.getPlayerLeft() == (lowercaseKeyCode)) { //left
      this.moveLeftPressed = false;
    }
    if (PlayerControlSettings.getPlayerRight() == (lowercaseKeyCode)) { //right
      this.moveRightPressed = false;
    }
    if (PlayerControlSettings.getPlayerUp() == (lowercaseKeyCode)) {
      this.jumpPressed = false;
    }
  }

  /**
   * runs continuously. handles player movement and physics
   */
  public draw(): void {
    this.checkHandleOffscreenDeath();
    this.handleMovement();
    this.show();
  }

  show(): void {
    mainSketch.fill(this.fillColor);
    mainSketch.strokeWeight(0);
    mainSketch.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);

    mainSketch.fill(Constants.PLAYER_HEALTH_TEXT_COLOR);
    mainSketch.textAlign(mainSketch.CENTER, mainSketch.CENTER);
    mainSketch.textSize(this.diameter / 2);
    mainSketch.text(
      this.health + "",
      this.pos.x - (this.diameter / 2), this.pos.y - (this.diameter / 2),
      this.diameter, this.diameter);
  }

  /**
   * active and add this to game
   */
  public makeActive(): void {
    platformer.addToAllKeyControllables(this); // connect this keyEvent() from main keyEvent()
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
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
    if (this.isDescendingDownEventBlock) {
      this.handleEventBlockDescent();
    } else {
      // this is NOT controllable horizontally when level is finished
      if (!mainSketch.getCurrentActiveLevel().isHandlingLevelComplete()) {
        this.handleHorizontalMovement();
      }
      this.handleVerticalMovement();
    }

    this.pos.add(this.vel);
  }

  /**
   * handle death of this
   */
  handleDeath(isOffscreenDeath: boolean): void {
    this.canHaveContactWithEnemies = false; // prevent enemy contact with this after this' death
    platformer.resetLevel();
  }

  /**
   * handle contact with horizontal boundary
   */
  public handleContactWithHorizontalBoundary(boundaryYPoint: number, isFloorBoundary: boolean): void {
    if (isFloorBoundary) { // floor-like boundary
      if (this.vel.y >= 0) { // boundary only act like floor if this is on top or falling onto boundary
        this.vel.y = 0;
        this.pos.y = boundaryYPoint - this.diameter / 2;
        this.shouldSetPreviousFloorBoundaryContact = true;
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
    this.vel.x = 0;
    if (this.pos.x > boundaryXPoint) { // left boundary
      this.ableToMoveLeft = false;
      this.pos.x = boundaryXPoint + this.diameter / 2;
    } else { // right boundary
      this.ableToMoveRight = false;
      this.pos.x = boundaryXPoint - this.diameter / 2;
    }
  }

  /**
   * handle contact with this and event boundary;
   * null endWarpPosition means launch event, non-null endWarpPosition means warp event
   */
  public handleContactWithEventBoundary(eventBlockTopBoundary: EventBlockTopBoundary,
                                        launchEventVerticalVelocity: number, endWarpPosition: p5.PVector) {
    this.isDescendingDownEventBlock = false;
    if (endWarpPosition == null) {
      this.vel.y = launchEventVerticalVelocity;
    } else {
      this.pos.x = endWarpPosition.x;
      this.pos.y = endWarpPosition.y;

      mainSketch.getCurrentActiveViewBox().setViewBoxHorizontalPosition(this.pos.x);
      this.vel.y = Constants.CHARACTER_WARP_EVENT_VERTICAL_VELOCITY;
    }

    this.previousFloorBoundaryContact = null; // to prevent this going through floor boundaries

    // event block top boundary can affect player again
    this.shouldSetPreviousFloorBoundaryContact = false;
    eventBlockTopBoundary.setDoesAffectPlayer(true);
    platformer.addToAllKeyControllables(this); // enable controls for this
  }

  /**
   * set controls pressed to false
   */
  public resetControlPressed(): void {
    this.moveLeftPressed = false;
    this.moveRightPressed = false;
    this.jumpPressed = false;
  }

  /**
   * handle wall sliding physics
   */
  private handleOnWallPhysics(): void {
    this.vel.y = Math.min(this.vel.y + Constants.WALL_SLIDE_ACCELERATION.y, Constants.MAX_VERTICAL_VELOCITY);
  }

  /**
   * handle jump on enemy physics
   */
  handleJumpKillEnemyPhysics(): void {
    this.vel.y = Constants.PLAYER_JUMP_KILL_ENEMY_HOP_VERTICAL_VELOCITY;
    //  prevent fall through floor after killing enemy while touching floor
    this.shouldSetPreviousFloorBoundaryContact = false;
    this.previousFloorBoundaryContact = null;
  }

  /**
   * change health of this by given amount;
   * handle death if death is 0
   */
  public changeHealth(healthChangeAmount: number): void {
    this.health += healthChangeAmount;
    if (this.health <= 0) {
      this.handleDeath(false);
    } else if (healthChangeAmount < 0) {
      this.canHaveContactWithEnemies = false;
      this.fillColor = Constants.PLAYER_DAMAGED_COLOR;
      ResourceUtils.playSong(ESongType.PLAYER_DAMAGE);

      setTimeout(
        () => {
          this.canHaveContactWithEnemies = true;
          this.fillColor = Constants.PLAYER_DEFAULT_COLOR;
        },
        ResourceUtils.getSongDurationMilliSec(ESongType.PLAYER_DAMAGE) // wait for song duration
      );
    }
  }

  /**
   * handle this descent down event block
   */
  private handleEventBlockDescent(): void {
    if (this.eventBlockTopBoundaryContacts.size == 1) {
      this.resetControlPressed();
      platformer.deleteFromAllKeyControllables(this); // disconnect this keyEvent() from main keyEvent()

      const firstEventTopBoundaryContacts: EventBlockTopBoundary =
        this.eventBlockTopBoundaryContacts.values().next().value; // get only value in set

      const middleOfBoundary = Math.round(
        (firstEventTopBoundaryContacts.getEndPoint().x + firstEventTopBoundaryContacts.getStartPoint().x) / 2);

      firstEventTopBoundaryContacts.setDoesAffectPlayer(false);
      this.pos.x = middleOfBoundary;
      this.vel.x = 0;
      this.vel.y = Constants.EVENT_BLOCK_DESCENT_VERTICAL_VELOCITY;
      ResourceUtils.playSong(ESongType.EVENT_BLOCK_DESCENT);
    }
  }

  /**
   * handle horizontal movement of this
   */
  private handleHorizontalMovement(): void {
    if (this.moveLeftPressed && this.ableToMoveLeft) {
      this.vel.x = -Constants.PLAYER_MOVEMENT_SPEED;
    }
    if (this.moveRightPressed && this.ableToMoveRight) {
      this.vel.x = Constants.PLAYER_MOVEMENT_SPEED;
    }
    if (!this.moveLeftPressed && !this.moveRightPressed) {
      this.vel.x = 0;
    }
  }

  /**
   * handle vertical movement of this
   */
  private handleVerticalMovement(): void {
    if (this.jumpPressed) { // jump button pressed/held
      if (this.numberOfFloorBoundaryContacts > 0 ||
        (this.numberOfVerticalBoundaryContacts > 0 && this.numberOfCeilingBoundaryContacts == 0)) { // able to jump
        ResourceUtils.playSong(ESongType.PLAYER_ACTION);
        this.vel.y = Constants.CHARACTER_JUMP_VERTICAL_VELOCITY;

        this.shouldSetPreviousFloorBoundaryContact = false;
        this.previousFloorBoundaryContact = null;
      } else {
        // for jumping higher the longer jump button is held
        this.vel.y = Math.min(
          this.vel.y + Constants.GRAVITY.y * Constants.VARIABLE_JUMP_GRAVITY_MULTIPLIER,
          Constants.MAX_VERTICAL_VELOCITY);
      }

    } else { // jump button not pressed
      if (this.numberOfVerticalBoundaryContacts > 0) { // touching wall
        this.handleOnWallPhysics();
      } else if (this.numberOfFloorBoundaryContacts == 0) { // in air
        this.handleInAirPhysics();
      }
    }
  }

  /**
   * change numberOfCeilingBoundaryContacts by given amount
   */
  public changeNumberOfCeilingBoundaryContacts(amount: number): void {
    this.numberOfCeilingBoundaryContacts += amount;
  }

  /**
   * change numberOfVerticalBoundaryContacts by given amount
   */
  public changeNumberOfVerticalBoundaryContacts(amount: number): void {
    this.numberOfVerticalBoundaryContacts += amount;
  }

  /*** getters and setters ***/
  isCanHaveContactWithEnemies(): boolean {
    return this.canHaveContactWithEnemies;
  }

  public getEventBlockTopBoundaryContacts(): Set<EventBlockTopBoundary> {
    return this.eventBlockTopBoundaryContacts;
  }

  public isMoveLeftPressed(): boolean {
    return this.moveLeftPressed;
  }

  public isMoveRightPressed(): boolean {
    return this.moveRightPressed;
  }

  public setAbleToMoveRight(ableToMoveRight: boolean): void {
    this.ableToMoveRight = ableToMoveRight;
  }

  public setAbleToMoveLeft(ableToMoveLeft: boolean): void {
    this.ableToMoveLeft = ableToMoveLeft;
  }

  public getPreviousFloorBoundaryContact(): HorizontalBoundary {
    return this.previousFloorBoundaryContact;
  }

  public setPreviousFloorBoundaryContact(previousFloorBoundaryContact: HorizontalBoundary): void {
    this.previousFloorBoundaryContact = previousFloorBoundaryContact;
  }

  public isShouldSetPreviousFloorBoundaryContact(): boolean {
    return this.shouldSetPreviousFloorBoundaryContact;
  }

}