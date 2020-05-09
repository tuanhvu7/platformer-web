import { AMenuWithKeyboardControl } from './menu-with-keyboard-control.abstract';
import { constants } from '../../const/constants';
import { ResourceUtils } from '../../utils/resource-utils';
import { LevelSelectMenuPanel } from './panels/level-select-menu-panel';
import { mainSketch } from '../../main';
import { platformer } from '../../platformer';
import { APanel } from './panels/panel.abstract';
import { EReservedControlKeys } from '../../utils/reserved-control-utils';
import { ESongType } from '../../enums/song-type.enum';

export class LevelSelectMenu extends AMenuWithKeyboardControl {
  /**
   * set properties of this
   */
  constructor(isActive: boolean) {
    super(isActive);
  }

  /**
   * setup and activate this
   */
  public setupActivateMenu(): void {
    // make this active
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
    platformer.addToAllKeyControllables(this); // connect this keyEvent() from main keyEvent()

    let leftXPanelPosition: number = 100;
    let topYPanelPosition: number = 100;
    for (let i = 1; i < constants.LEVELS_HEIGHT_ARRAY.length; i++) {
      if (leftXPanelPosition + constants.PANEL_SIZE > ResourceUtils.DEFAULT_MENU_IMAGE.width) {
        leftXPanelPosition = 100;
        topYPanelPosition += (100 + constants.PANEL_SIZE);
      }

      this.panelsList.push(new LevelSelectMenuPanel(
        i,
        leftXPanelPosition,
        topYPanelPosition,
        constants.PANEL_SIZE,
        constants.PANEL_SIZE,
        true
      ));

      leftXPanelPosition += constants.PANEL_SIZE + 100;
    }

    ResourceUtils.loopSong(ESongType.OUT_OF_LEVEL_MENU);
  }

  /**
   * runs continuously; draws background of this
   */
  public draw(): void {
    mainSketch.background(ResourceUtils.DEFAULT_MENU_IMAGE);
  }


  /**
   * handle keypress
   */
  public keyPressed(): void {
    const keyPressed = mainSketch.key;
    if (EReservedControlKeys.c.toString().toLowerCase() === (keyPressed.toLowerCase())) {  // toggle checkpoint start
      this.panelsList.forEach((curPanel: APanel) => {
        (<LevelSelectMenuPanel>curPanel).toggleLoadLevelFromCheckpoint();
      });
    } else if (EReservedControlKeys.u.toString().toLowerCase() === (keyPressed.toLowerCase())) {   // switch to user control menu
        platformer.getLevelSelectMenu().deactivateMenu();
        platformer.getChangePlayerControlMenu().setupActivateMenu();
    }
  }

}