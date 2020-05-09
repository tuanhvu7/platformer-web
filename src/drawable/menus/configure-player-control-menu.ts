import { AMenuWithKeyboardControl } from "./menu-with-keyboard-control.abstract";
import { platformer } from '../../platformer';
import { constants } from "../../const/constants";
import { ResourceUtils } from "../../utils/resource-utils";
import { mainSketch } from '../../main';
import { APanel } from "./panels/panel.abstract";
import { ConfigurePlayerControlPanel } from "./panels/configure-player-control-panel";
import { EConfigurablePlayerControls } from "../../enums/configurable-player-controls.enum";
import { ESongType } from "../../enums/song-type.enum";
import { EReservedControlKeys } from "../../utils/reserved-control-utils";

/**
 * Menu to change player controls
 */
export class ConfigurePlayerControlMenu extends AMenuWithKeyboardControl {

  /**
   * set properties of this
   */
  constructor(isActive: boolean) {
    super(isActive);
  }

  /**
   * setup and activate this
   */
  public setupActivateMenu() {
    // make this active
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
    platformer.addToAllKeyControllables(this); // connect this draw() from main draw()
    let leftXPanelPosition = 100;
    let topYPanelPosition = 100;

    for (let curConfigurablePlayerControls in EConfigurablePlayerControls) {
      if (leftXPanelPosition + constants.PANEL_SIZE > ResourceUtils.DEFAULT_MENU_IMAGE.width) {
        leftXPanelPosition = 100;
        topYPanelPosition += (100 + constants.PANEL_SIZE);
      }

      this.panelsList.push(new ConfigurePlayerControlPanel(
        curConfigurablePlayerControls as any, // any for enum
        leftXPanelPosition,
        topYPanelPosition,
        constants.PANEL_SIZE,
        constants.PANEL_SIZE,
        true
      ));

      leftXPanelPosition += constants.PANEL_SIZE + 100;
      ResourceUtils.loopSong(ESongType.OUT_OF_LEVEL_MENU);
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
    if (EReservedControlKeys.u.toString().toLowerCase() == keyPressed.toLowerCase()) { // switch to level select equalsIgnoreCase
      this.deactivateMenu();
      platformer.getLevelSelectMenu().setupActivateMenu();
    }
  }

  /**
   * reset all of this' panel colors and unregister from all of this' panel keyEvent
   */
  public resetPanelsColorAndUnregisterKeyEvent(): void {
    this.panelsList.forEach((curPanel: APanel) => {
      (<ConfigurePlayerControlPanel> curPanel).resetColorAndUnregisterKeyEvent();
    });
  }
}