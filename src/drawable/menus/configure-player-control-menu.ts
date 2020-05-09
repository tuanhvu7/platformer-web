import { AMenuWithKeyboardControl } from "./menu-with-keyboard-control.abstract";
import { platformer } from '../../platformer';
import { constants } from "../../const/constants";
import { ResourceUtils } from "../../utils/resource-utils";
import { mainSketch } from '../../main';
import { APanel } from "./panels/panel.abstract";
import { ConfigurePlayerControlPanel } from "./panels/configure-player-control-panel";
import { EConfigurablePlayerControls } from "../../enums/configurable-player-controls.enum";
import { EReservedControlKeys } from "../../enums/reserved-control-keys.enum";

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
    platformer.addToAllKeyControllables(this); // connect this key events from main key events
    let leftXPanelPosition = 100;
    let topYPanelPosition = 100;

    Object.keys(EConfigurablePlayerControls).forEach((curConfigControl: string) => {
      if (leftXPanelPosition + constants.PANEL_SIZE > ResourceUtils.DEFAULT_MENU_IMAGE.width) {
        leftXPanelPosition = 100;
        topYPanelPosition += (100 + constants.PANEL_SIZE);
      }

      this.panelsList.push(new ConfigurePlayerControlPanel(
        curConfigControl as any, // any for enum
        leftXPanelPosition,
        topYPanelPosition,
        constants.PANEL_SIZE,
        constants.PANEL_SIZE,
        true
      ));

      leftXPanelPosition += constants.PANEL_SIZE + 100;
    });
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
    console.log('ConfigurePlayerControlMenu', keyPressed);
    if (EReservedControlKeys.l.toLowerCase() == keyPressed.toLowerCase()) { // switch to level select equalsIgnoreCase
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