import { IDrawable } from "../drawable.interface";
import { platformer } from '../../platformer';
import { mainSketch } from '../../main';

/**
 * common for rectangular collectables
 */
export abstract class ACollectable implements IDrawable {

  fillColor: number;

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
  constructor(leftX: number, topY: number, width: number, height: number,
              blockLineThickness: number, isActive: boolean) {

    this.leftX = leftX;
    this.topY = topY;
    this.width = width;
    this.height = height;

    this.blockLineThickness = blockLineThickness;

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