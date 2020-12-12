import { IDrawable } from "../drawable.interface";
import { platformer } from '../../platformer';
import { mainSketch } from '../../main';
import { IACollectableProps } from "./collectable-prop.interfaces";
import { handleDefaultValue } from '../../utils/ccommon-utils';
import { constants } from '../../const/constants';

/**
 * common for rectangular collectables
 */
export abstract class ACollectable implements IDrawable {

  fillColor!: string;

  // position and dimensions
  leftX: number;
  topY: number;
  readonly width: number;
  readonly height: number;

  readonly blockLineThickness: number;

  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  constructor(aCollectableProps: IACollectableProps) {
    /** START default values if optional prop(s) not defined */
    const initActive = handleDefaultValue(aCollectableProps.initAsActive, true);

    this.blockLineThickness = handleDefaultValue(
      aCollectableProps.blockLineThickness,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS);
    /** END default values if optional prop(s) not defined */

    this.leftX = aCollectableProps.leftX;
    this.topY = aCollectableProps.topY;
    this.width = aCollectableProps.width;
    this.height = aCollectableProps.height;

    if (initActive) {
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
   * display block
   */
  show(): void {
    mainSketch.fill(this.fillColor);
    mainSketch.strokeWeight(this.blockLineThickness);
    mainSketch.rect(this.leftX, this.topY, this.width, this.height);
  }

  /**
   * check and handle contact with player;
   * to override in extended classes
   */
  abstract checkHandleContactWithPlayer(): void;

  /**
   * true means this contact with player
   */
  contactWithPlayer(): boolean {
    const curPlayer = platformer.getCurrentActivePlayer();
    if (!curPlayer) return false;

    const playerInHorizontalRange =
      (curPlayer.getPos().x + (curPlayer.getDiameter() / 2) >= this.leftX) &&
      (curPlayer.getPos().x - (curPlayer.getDiameter() / 2) <= this.leftX + this.width);

    const playerInVerticalRange =
      (curPlayer.getPos().y + (curPlayer.getDiameter() / 2) >= this.topY) &&
      (curPlayer.getPos().y - (curPlayer.getDiameter() / 2) <= this.topY + this.height);

    return playerInHorizontalRange && playerInVerticalRange;
  }

  /*** getters and setters ***/
  public setLeftX(leftX: number): void {
    this.leftX = leftX;
  }

  public setTopY(topY: number): void {
    this.topY = topY;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}