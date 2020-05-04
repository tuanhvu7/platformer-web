import { IDrawable } from "../drawable.interface";
import * as p5 from 'p5';
import { platformer } from '../../platformer';
import { mainSketch } from "../../main";
import { Constants } from "../../const/constants";

/**
 * Common for line boundaries
 */
export abstract class ABoundary implements IDrawable {

  // start point (smaller x and smaller y) coordinate for boundary
  readonly startPoint: p5.PVector;
  // end point (larger x and larger y) coordinate for boundary
  readonly endPoint: p5.PVector;

  // stoke thickness of boundary
  private readonly boundaryLineThickness: number;

  // true means visible to player
  private isVisible: boolean;

  // true means check and handle collision between this and player characters
  doesAffectPlayer: boolean;

  // true means check and handle collision between this and non-player characters
  readonly doesAffectNonPlayers: boolean;

  // set of all characters that are touching this
  readonly charactersTouchingThis: Set<ACharacter>;

  /**
   * set properties of this
   *
   * @param x1Point  first x coordinate
   * @param y1Point  first y coordinate
   * @param x2Offset difference between first and second x coordinates (x2 - x1)
   * @param y2Offset difference between first and second y coordinates (y2 - y1)
   */
  constructor(x1Point: number, y1Point: number, x2Offset: number, y2Offset: number, boundaryLineThickness: number,
              isVisible: boolean, doesAffectPlayer: boolean, doesAffectNonPlayers: boolean,
              isActive: boolean) {

    // set start points to be smaller of given values
    this.startPoint = new p5.PVector(
      Math.min(x1Point, x1Point + x2Offset),
      Math.min(y1Point, y1Point + y2Offset));

    // set end points to be larger of given values
    this.endPoint = new p5.PVector(
      Math.max(x1Point, x1Point + x2Offset),
      Math.max(y1Point, y1Point + y2Offset));

    this.boundaryLineThickness = boundaryLineThickness;

    this.isVisible = isVisible;
    this.doesAffectPlayer = doesAffectPlayer;
    this.doesAffectNonPlayers = doesAffectNonPlayers;

    this.charactersTouchingThis = new Set();

    if (isActive) {
      this.makeActive();
    }
  }

  /**
   * runs continuously
   */
  public draw(): void {
    this.show();
    if (platformer.getCurrentActivePlayer() != null) {
      this.checkHandleContactWithPlayer();
    }
    this.checkHandleContactWithNonPlayerCharacters();
  }

  /**
   * check and handle contact with player
   */
  abstract checkHandleContactWithPlayer(): void;

  /**
   * check and handle contact with non-player characters
   */
  abstract checkHandleContactWithNonPlayerCharacters(): void;

  /**
   * display line boundary
   */
  show(): void {
    if (this.isVisible) {
      mainSketch.stroke(Constants.BOUNDARY_COLOR);
      mainSketch.strokeWeight(this.boundaryLineThickness);
      mainSketch.line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    }
  }

  /**
   * active and add this to game
   */
  public makeActive(): void {
    this.charactersTouchingThis.clear();
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
  }

  /*** getters and setters ***/
  public getStartPoint(): p5.PVector {
    return this.startPoint;
  }

  public getEndPoint(): p5.PVector {
    return this.endPoint;
  }

  public setVisible(visible: boolean): void {
    this.isVisible = visible;
  }

  public setDoesAffectPlayer(doesAffectPlayer: boolean): void {
    this.doesAffectPlayer = doesAffectPlayer;
  }

}