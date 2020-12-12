import { ACollectable } from "./collectable.abstract";
import { constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { IACollectableProps } from './collectable-prop.interfaces';

/**
 * checkpoint
 */
export class Checkpoint extends ACollectable {

  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  constructor(checkpointProps: IACollectableProps) {
    super(checkpointProps);
    this.fillColor = constants.CHECKPOINT_COLOR;
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    if (this.contactWithPlayer()) {
      platformer.getCurrentActiveLevel().setLoadPlayerFromCheckPoint(true);
      this.makeNotActive();
      platformer.getCurrentActiveLevelDrawableCollection().removeDrawable(this);
    }
  }

}