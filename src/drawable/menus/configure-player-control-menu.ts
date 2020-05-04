import { AMenuWithKeyboardControl } from "./menu-with-keyboard-control.abstract";
import { platformer } from '../../platformer';
import { Constants } from "../../const/constants";
import { ResourceUtils } from "../../utils/resource-utils";
import { mainSketch } from '../../main';
import { APanel } from "./panels/panel.abstract";
import { ConfigurePlayerControlPanel } from "./panels/configure-player-control-panel";

/**
 * Menu to change player controls
 */
export class ConfigurePlayerControlMenu extends AMenuWithKeyboardControl {

  /**
   * set properties of this
   */
  public ConfigurePlayerControlMenu(isActive: boolean) {
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

    EConfigurablePlayerControls.values().forEach((curConfigurablePlayerControls: EConfigurablePlayerControls) => {
      if (leftXPanelPosition + Constants.PANEL_SIZE > ResourceUtils.DEFAULT_MENU_IMAGE.width) {
        leftXPanelPosition = 100;
        topYPanelPosition += (100 + Constants.PANEL_SIZE);
      }

      this.panelsList.add(new ConfigurePlayerControlPanel(
        curConfigurablePlayerControls,
        leftXPanelPosition,
        topYPanelPosition,
        Constants.PANEL_SIZE,
        Constants.PANEL_SIZE,
        true
      ));

      leftXPanelPosition += Constants.PANEL_SIZE + 100;
      ResourceUtils.loopSong(ESongType.OUT_OF_LEVEL_MENU);
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
    if (ReservedControlUtils.EReservedControlKeys.u.toString().equalsIgnoreCase(keyPressed)) { // switch to level select
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