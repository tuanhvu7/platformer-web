import { IDrawable } from '../drawable.interface';
import { APanel } from './panels/panel.abstract';
import { platformer } from '../../platformer';

export abstract class AMenu implements IDrawable {
  readonly horizontalOffset: number;
  panelsList: APanel[];

  /**
   * set properties of this;
   * sets this to have given offset
   */
  constructor(initAsActive: boolean, horizontalOffset?: number) {
    if (horizontalOffset) {
      this.horizontalOffset = horizontalOffset;
    } else {
      this.horizontalOffset = 0;
    }
    this.panelsList = [];
    if (initAsActive) {
        this.setupActivateMenu();
    }
  }

  public abstract draw(): void;

  /**
   * activate and setup this; to override in extended classes
   */
  abstract setupActivateMenu(): void;

  /**
   * deactivate this
   */
  public deactivateMenu(): void {
    this.panelsList.forEach((curPanel: APanel) => {
      curPanel.makeNotActive();
    });
    

    this.panelsList = [];
    // make this not active
    platformer.addToAllDrawables(this); // disconnect this draw() from main draw()
  }
}