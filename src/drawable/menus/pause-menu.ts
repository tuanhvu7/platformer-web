import { AMenu } from "./menu.abstract";
import { platformer } from '../../platformer';
import { PauseMenuPanel } from "./panels/pause-menu-panel";
import { constants } from "../../const/constants";
import { EPauseMenuButtonType } from "../../enums/pause-menu-button-type.enum";

/**
 * pause menu
 */
export class PauseMenu extends AMenu {

  /**
   * set properties of this
   */
  constructor(horizontalOffset: number, initAsActive: boolean) {
    super(initAsActive, horizontalOffset);
  }

  /**
   * setup and activate this
   */
  public setupActivateMenu(): void {
    // make this active
    platformer.addToAllDrawables(this); // connect this draw() from main draw()

    this.panelsList.push(new PauseMenuPanel({
      panelType: EPauseMenuButtonType.CONTINUE,
      leftX: 100 + this.horizontalOffset, // add offset to account for viewbox,
      topY: 100,
      width: constants.PANEL_SIZE,
      height: constants.PANEL_SIZE,
      horizontalOffset: this.horizontalOffset
    }));

    this.panelsList.push(new PauseMenuPanel({
      panelType: EPauseMenuButtonType.QUIT,
      leftX: (2 * 100) + constants.PANEL_SIZE + this.horizontalOffset, // add offset to account for viewbox
      topY: 100,
      width: constants.PANEL_SIZE,
      height: constants.PANEL_SIZE,
      horizontalOffset: this.horizontalOffset
    }));
  }

  /**
   * runs continuously
   */
  public draw(): void {}
}