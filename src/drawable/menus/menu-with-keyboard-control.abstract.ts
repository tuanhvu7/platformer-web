import { AMenu } from './menu.abstract';
import { APanel } from './panels/panel.abstract';
import { mainSketch } from '../../main';

export abstract class AMenuWithKeyboardControl extends AMenu {
  constructor(isActive: boolean) {
    super(isActive);
  }

  public deactivateMenu(): void {
    this.panelsList.forEach((curPanel: APanel) => {
      curPanel.makeNotActive();
    });

    this.panelsList = [];
    // make this not active
    mainSketch.unregisterMethod("draw", this); // disconnect this draw() from main draw()
    mainSketch.unregisterMethod("keyEvent", this); // disconnect this keyEvent() from main keyEvent()
  }
}