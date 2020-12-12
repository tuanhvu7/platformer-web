import { AMenu } from './menu.abstract';
import { APanel } from './panels/panel.abstract';
import { platformer } from '../../platformer';
import { IKeyControllable } from '../key-controllable.interface';

export abstract class AMenuWithKeyboardControl extends AMenu implements IKeyControllable {
  constructor(initAsActive: boolean) {
    super(initAsActive);
  }

  public abstract keyPressed(): void;

  public deactivateMenu(): void {
    this.panelsList.forEach((curPanel: APanel) => {
      curPanel.makeNotActive();
    });

    this.panelsList = [];
    // make this not active
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
    platformer.deleteFromAllKeyControllables(this); // disconnect this keyEvent() from main keyEvent()
  }
}