import { APanel } from "./panel.abstract";
import { Constants } from "../../../const/constants";
import { ResourceUtils } from "../../../utils/resource-utils";
import { platformer } from '../../../platformer';
import { mainSketch } from '../../../main';
import { EPauseMenuButtonType } from "../../../enums/pause-menu-button-type.enum";
import { ESongType } from "../../../enums/song-type.enum";

/**
 * panels in pause menu
 */
export class PauseMenuPanel extends APanel {

  // horizontal offset of this due to viewbox
  private readonly horizontalOffset: number;

  // panel type
  private readonly panelType: EPauseMenuButtonType;

  /**
   * set properties of this
   */
  constructor(panelType: EPauseMenuButtonType,
              leftX: number, topY: number, width: number, height: number,
              horizontalOffset: number, isActive: boolean) {
    super(Constants.DEFAULT_PANEL_COLOR, panelType.toString(), leftX, topY, width, height, isActive);
    this.horizontalOffset = horizontalOffset;
    this.panelType = panelType;
  }

  /**
   * to execute when this panel is clicked
   */
  executeWhenClicked(): void {
    if (this.panelType == EPauseMenuButtonType.CONTINUE) {
      ResourceUtils.loopSong(ESongType.LEVEL);
      platformer.getCurrentActiveLevel().setPaused(false);
      platformer.getCurrentActiveLevel().closePauseMenu();

    } else {
      platformer.getCurrentActiveLevel().closePauseMenu();
      platformer.getCurrentActiveLevel().deactivateLevel();
      platformer.setCurrentActiveLevelNumber(0);
      platformer.getLevelSelectMenu().setupActivateMenu();
    }

    mainSketch.loop();
  }

  /**
   * return if mouse position inside this panel
   */
  isMouseIn(): boolean {
    return mainSketch.mouseX > this.leftX - this.horizontalOffset && // subtract offset since mouseX is unaffected by viewbox
      mainSketch.mouseX < this.rightX - this.horizontalOffset && // subtract offset since mouseX is unaffected by viewbox
      mainSketch.mouseY > this.topY &&
      mainSketch.mouseY < this.bottomY;
  }

}