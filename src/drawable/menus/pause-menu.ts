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
  constructor(horizontalOffset: number, isActive: boolean) {
    super(isActive, horizontalOffset);
  }

  /**
   * setup and activate this
   */
  public setupActivateMenu(): void {
    // make this active
    platformer.addToAllDrawables(this); // connect this draw() from main draw()

    this.panelsList.push(new PauseMenuPanel(
      EPauseMenuButtonType.CONTINUE,
      100 + this.horizontalOffset, // add offset to account for viewbox
      100,
      constants.PANEL_SIZE,
      constants.PANEL_SIZE,
      this.horizontalOffset,
      true
    ));

    this.panelsList.push(new PauseMenuPanel(
      EPauseMenuButtonType.QUIT,
      400 + this.horizontalOffset, // add offset to account for viewbox
      100,
      constants.PANEL_SIZE,
      constants.PANEL_SIZE,
      this.horizontalOffset,
      true
    ));
  }

  /**
   * runs continuously
   */
  public draw(): void {}
}