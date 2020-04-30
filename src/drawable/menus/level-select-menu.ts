import { AMenuWithKeyboardControl } from './menu-with-keyboard-control.abstract';
import * as p5 from 'p5';
import { Constants } from '../../const/constants';
import { ResourceUtils } from '../../utils/resource-utils';
import { LevelSelectMenuPanel } from './panels/level-select-menu-panel';
import { mainSketch } from '../../main';

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
    mainSketch.registerMethod("draw", this); // connect this draw() from main draw()
    mainSketch.registerMethod("keyEvent", this); // connect this keyEvent() from main keyEvent()

    let leftXPanelPosition: number = 100;
    let topYPanelPosition: number = 100;
    for (let i = 1; i < Constants.LEVELS_HEIGHT_ARRAY.length; i++) {
      if (leftXPanelPosition + Constants.PANEL_SIZE > ResourceUtils.DEFAULT_MENU_IMAGE.width) {
        leftXPanelPosition = 100;
        topYPanelPosition += (100 + Constants.PANEL_SIZE);
      }

      this.panelsList.push(new LevelSelectMenuPanel(
        i,
        leftXPanelPosition,
        topYPanelPosition,
        Constants.PANEL_SIZE,
        Constants.PANEL_SIZE,
        true
      ));

      leftXPanelPosition += Constants.PANEL_SIZE + 100;
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
    console.log(p5.key);
  }

}