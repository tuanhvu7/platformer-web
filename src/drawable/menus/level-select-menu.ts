import { AMenuWithKeyboardControl } from './menu-with-keyboard-control.abstract';
import { constants } from '../../const/constants';
import { ResourceUtils } from '../../utils/resource-utils';
import { LevelSelectMenuPanel } from './panels/level-select-menu-panel';
import { mainSketch } from '../../main';
import { platformer } from '../../platformer';

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
    // if (ReservedControlUtils.EReservedControlKeys.c.toString().equalsIgnoreCase(keyPressed)) {  // toggle checkpoint start
    //     for (APanel curPanel : this.panelsList) {
    //         ((LevelSelectMenuPanel) curPanel).toggleLoadLevelFromCheckpoint();
    //     }
    // } else if (ReservedControlUtils.EReservedControlKeys.u.toString().equalsIgnoreCase(keyPressed)) {   // switch to user control menu
    //     mainSketch.getLevelSelectMenu().deactivateMenu();
    //     mainSketch.getChangePlayerControlMenu().setupActivateMenu();
    // }
  }

}