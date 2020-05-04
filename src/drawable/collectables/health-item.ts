import { ACollectable } from "./collectable.abstract";
import { Constants } from "../../const/constants";
import { mainSketch } from '../../main';
import { platformer } from '../../platformer';
/**
 * health item for player
 */
export class HealthItem extends ACollectable {

  private readonly healthChangeAmount: number;

  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  constructor(healthChangeAmount: number,
              leftX: number, topY: number, width: number, height: number,
              blockLineThickness: number, isActive: boolean) {
    super(leftX, topY, width, height, blockLineThickness, isActive);
    this.healthChangeAmount = healthChangeAmount;
    this.fillColor = Constants.HEALTH_ITEM_COLOR;
  }

  show(): void {
    mainSketch.fill(this.fillColor);
    mainSketch.strokeWeight(this.blockLineThickness);
    mainSketch.rect(this.leftX, this.topY, this.width, this.height);
    if (this.healthChangeAmount > 0) {
      mainSketch.fill(Constants.POSITIVE_HEALTH_ITEM_TEXT_COLOR);
    } else if (this.healthChangeAmount == 0) {
      mainSketch.fill(Constants.ZERO_HEALTH_ITEM_TEXT_COLOR);
    } else {
      mainSketch.fill(Constants.NEGATIVE_HEALTH_ITEM_TEXT_COLOR);
    }
    mainSketch.textAlign(mainSketch.CENTER, mainSketch.CENTER);
    mainSketch.textSize(Math.min(this.width / 2, this.height / 2));
    mainSketch.text(
      Math.abs(this.healthChangeAmount) + "",
      this.leftX,
      this.topY,
      this.width,
      this.height);
  }

  checkHandleContactWithPlayer(): void {
    if (this.contactWithPlayer()) {
      platformer.getCurrentActivePlayer().changeHealth(this.healthChangeAmount);
      this.makeNotActive();
      platformer.getCurrentActiveLevelDrawableCollection().removeDrawable(this);
    }
  }
}