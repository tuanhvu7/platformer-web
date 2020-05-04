import { APanel } from './panel.abstract';
import { Constants } from '../../../const/constants';
import { platformer } from '../../../platformer';
import { levelFactory } from '../../levels/level.factory';

export class LevelSelectMenuPanel extends APanel {

  // level associated with this
  private readonly panelLevel: number;

  // true means load level from checkpoint
  private loadLevelFromCheckpoint: boolean;

  /**
   * set properties of this
   */
  constructor(panelLevel: number, leftX: number, topY: number,
              width: number, height: number, isActive: boolean) {
    super(Constants.DEFAULT_PANEL_COLOR, panelLevel + '', leftX, topY, width, height, isActive);
    this.panelLevel = panelLevel;
    this.loadLevelFromCheckpoint = false;
  }

  /**
   * active and add this to game
   */
  makeActive(): void {
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
    platformer.addToAllMouseControllables(this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
    platformer.deleteFromAllMouseControllables(this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * to execute when this panel is clicked
   */
  executeWhenClicked(): void {
    platformer.getLevelSelectMenu().deactivateMenu();
    // setup and load level associated with this
    platformer.setCurrentActiveLevelNumber(this.panelLevel);
    platformer.setCurrentActiveLevel(levelFactory.getLevel(true, this.loadLevelFromCheckpoint));
  }

  /**
   * toggle loadLevelFromCheckpoint
   */
  toggleLoadLevelFromCheckpoint(): void {
    this.loadLevelFromCheckpoint = !this.loadLevelFromCheckpoint;
    if (this.loadLevelFromCheckpoint) {
      this.panelColor = Constants.ALTERNATE_PANEL_COLOR;
    } else {
      this.panelColor = Constants.DEFAULT_PANEL_COLOR;
    }
  }
}