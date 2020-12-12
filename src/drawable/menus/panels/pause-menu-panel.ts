import { APanel } from "./panel.abstract";
import { constants } from "../../../const/constants";
import { ResourceUtils } from "../../../utils/resource-utils";
import { platformer } from '../../../platformer';
import { mainSketch } from '../../../main';
import { EPauseMenuButtonType } from "../../../enums/pause-menu-button-type.enum";
import { ESongType } from "../../../enums/song-type.enum";
import { IPauseMenuPanelProps } from './panel-prop.interfaces';

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
  constructor(pauseMenuPanelProps: IPauseMenuPanelProps) {
    super({
      ...pauseMenuPanelProps,
      panelColor: constants.DEFAULT_PANEL_COLOR,
      panelText: pauseMenuPanelProps.panelType.toString()
    })

    this.horizontalOffset = pauseMenuPanelProps.horizontalOffset;
    this.panelType = pauseMenuPanelProps.panelType;
  }

  /**
   * to execute when this panel is clicked
   */
  executeWhenClicked(): void {
    if (this.panelType === EPauseMenuButtonType.CONTINUE) {
      ResourceUtils.loopSong(ESongType.LEVEL);
      platformer.getCurrentActiveLevel().setPaused(false);
      platformer.getCurrentActiveLevel().closePauseMenu();

    } else {
      platformer.getCurrentActiveLevel().closePauseMenu();
      platformer.getCurrentActiveLevel().deactivateLevel();
      platformer.setCurrentActiveLevelNumber(0);
      setTimeout(
        () => {
          ResourceUtils.loopSong(ESongType.OUT_OF_LEVEL_MENU);
          platformer.getLevelSelectMenu().setupActivateMenu();
        },
        250
      )
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