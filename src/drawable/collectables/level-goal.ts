import { ACollectable } from "./collectable.abstract";
import { constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { IACollectableProps } from './collectable-prop.interfaces';

/**
 * level goal
 */
export class LevelGoal extends ACollectable {
  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  constructor(levelGoalProps: IACollectableProps) {
    super(levelGoalProps);
    this.fillColor = constants.LEVEL_GOAL_COLOR;
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