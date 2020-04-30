import { APanel } from './panel.abstract';
import { Constants } from '../../../const/constants';
import { mainSketch } from '../../../main';

export class LevelSelectMenuPanel extends APanel {

  // level associated with this
  private readonly panelLevel: number;

  // true means load level from checkpoint
  private readonly loadLevelFromCheckpoint: boolean;

  /**
   * set properties of this
   */
  constructor(panelLevel: number, leftX: number, topY: number,
    width: number, height: number, isActive: boolean) {
    super(Constants.DEFAULT_PANEL_COLOR, panelLevel + "", leftX, topY, width, height, isActive);
    this.panelLevel = panelLevel;
    this.loadLevelFromCheckpoint = false;
  }

  /**
   * active and add this to game
   */
  makeActive(): void {
    mainSketch.registerMethod("draw", this); // connect this draw() from main draw()
    mainSketch.registerMethod("mouseEvent", this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    mainSketch.unregisterMethod("draw", this); // disconnect this draw() from main draw()
    mainSketch.unregisterMethod("mouseEvent", this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * to execute when this panel is clicked
   */
  executeWhenClicked(): void {
    //   mainSketch.getLevelSelectMenu().deactivateMenu();
    // setup and load level associated with this
    // mainSketch.setCurrentActiveLevelNumber(this.panelLevel);
    // LevelFactory levelFactory = new LevelFactory();
    // mainSketch.setCurrentActiveLevel(levelFactory.getLevel(mainSketch, true, this.loadLevelFromCheckpoint));
  }

  /**
   * toggle loadLevelFromCheckpoint
   */
  toggleLoadLevelFromCheckpoint(): void {
    //     this.loadLevelFromCheckpoint = !this.loadLevelFromCheckpoint;
    //     if (this.loadLevelFromCheckpoint) {
    //         this.panelColor = Constants.ALTERNATE_PANEL_COLOR;
    //     } else {
    //         this.panelColor = Constants.DEFAULT_PANEL_COLOR;
    //     }
  }
}