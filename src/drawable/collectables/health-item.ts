import { ACollectable } from "./collectable.abstract";
import { constants } from "../../const/constants";
import { mainSketch } from '../../main';
import { platformer } from '../../platformer';
import { IHealthItemProps } from "./collectable-prop.interfaces";
/**
 * health item for player
 */
export class HealthItem extends ACollectable {

  private readonly healthChangeAmount: number;

  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  constructor(healthItemProps: IHealthItemProps) {
    super(healthItemProps);
    this.healthChangeAmount = healthItemProps.healthChangeAmount;
    this.fillColor = constants.HEALTH_ITEM_COLOR;
  }

  show(): void {
    mainSketch.fill(this.fillColor);
    mainSketch.strokeWeight(this.blockLineThickness);
    mainSketch.rect(this.leftX, this.topY, this.width, this.height);
    if (this.healthChangeAmount > 0) {
      mainSketch.fill(constants.POSITIVE_HEALTH_ITEM_TEXT_COLOR);
    } else if (this.healthChangeAmount === 0) {
      mainSketch.fill(constants.ZERO_HEALTH_ITEM_TEXT_COLOR);
    } else {
      mainSketch.fill(constants.NEGATIVE_HEALTH_ITEM_TEXT_COLOR);
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
      platformer.getCurrentActivePlayer()?.changeHealth(this.healthChangeAmount);
      this.makeNotActive();
      platformer.getCurrentActiveLevelDrawableCollection().removeDrawable(this);
    }
  }
}