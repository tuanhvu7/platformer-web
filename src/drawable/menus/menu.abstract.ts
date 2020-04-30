import { IDrawable } from '../drawable.interface';
import { APanel } from './panels/panel.abstract';
import { mainSketch } from '../../main';

export abstract class AMenu implements IDrawable {
  readonly horizontalOffset: number;
  panelsList: APanel[];

  /**
   * set properties of this;
   * sets this to have given offset
   */
  constructor(isActive: boolean, horizontalOffset?: number) {
    if (horizontalOffset) {
      this.horizontalOffset = horizontalOffset;
    } else {
      this.horizontalOffset = 0;
    }
    this.panelsList = [];
    if (isActive) {
        this.setupActivateMenu();
    }
  }

  draw(): void {}

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
    mainSketch.unregisterMethod("draw", this); // disconnect this draw() from main draw()
  }
}