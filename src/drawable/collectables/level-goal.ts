import { ACollectable } from "./collectable.abstract";
import { Constants } from "../../const/constants";
import { platformer } from '../../platformer';

/**
 * level goal
 */
export class LevelGoal extends ACollectable {
  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  constructor(leftX: number, topY: number, width: number, height: number,
              blockLineThickness: number, isActive: boolean) {
    super(leftX, topY, width, height, blockLineThickness, isActive);
    this.fillColor = Constants.LEVEL_GOAL_COLOR;
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    if (this.contactWithPlayer()) {
      this.makeNotActive();
      platformer.getCurrentActiveLevelDrawableCollection().removeDrawable(this);
      platformer.handleLevelComplete();
    }
  }
}