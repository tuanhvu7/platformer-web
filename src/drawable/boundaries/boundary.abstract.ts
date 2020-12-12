import { IDrawable } from "../drawable.interface";
import { Vector } from 'p5';
import { platformer } from '../../platformer';
import { mainSketch } from "../../main";
import { constants } from "../../const/constants";
import { ACharacter } from "../characters/character.abstract";
import { IABoundaryProps } from "./boundary-prop.interfaces";
import { handleDefaultValue } from "../../utils/ccommon-utils";

/**
 * Common for line boundaries
 */
export abstract class ABoundary implements IDrawable {

  // start point (smaller x and smaller y) coordinate for boundary
  readonly startPoint: Vector;
  // end point (larger x and larger y) coordinate for boundary
  readonly endPoint: Vector;

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
  constructor(aboundaryProps: IABoundaryProps) {

    /** START default values if optional prop(s) not defined */
    const initAsActive = handleDefaultValue(aboundaryProps.initAsActive, true);

    this.isVisible = handleDefaultValue(aboundaryProps.isVisible, true);
    
    this.doesAffectPlayer = handleDefaultValue(aboundaryProps.doesAffectPlayer, true);
    
    this.doesAffectNonPlayers = handleDefaultValue(aboundaryProps.doesAffectNonPlayers, true);
        
    this.boundaryLineThickness = handleDefaultValue(
      aboundaryProps.boundaryLineThickness,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS);
    /** END default values if optional prop(s) not defined */

    // set start points to be smaller of given values
    this.startPoint = mainSketch.createVector(
      Math.min(aboundaryProps.x1Point, aboundaryProps.x1Point + aboundaryProps.x2Offset),
      Math.min(aboundaryProps.y1Point, aboundaryProps.y1Point + aboundaryProps.y2Offset)
    );

    // set end points to be larger of given values
    this.endPoint = mainSketch.createVector(
      Math.max(aboundaryProps.x1Point, aboundaryProps.x1Point + aboundaryProps.x2Offset),
      Math.max(aboundaryProps.y1Point, aboundaryProps.y1Point + aboundaryProps.y2Offset)
    );

    this.charactersTouchingThis = new Set();

    if (initAsActive) {
      this.makeActive();
    }
  }

  /**
   * runs continuously
   */
  public draw(): void {
    this.show();
    if (platformer.getCurrentActivePlayer()) {
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
      mainSketch.stroke(constants.BOUNDARY_COLOR);
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
  public getStartPoint(): Vector {
    return this.startPoint;
  }

  public getEndPoint(): Vector {
    return this.endPoint;
  }

  public setVisible(visible: boolean): void {
    this.isVisible = visible;
  }

  public setDoesAffectPlayer(doesAffectPlayer: boolean): void {
    this.doesAffectPlayer = doesAffectPlayer;
  }

}