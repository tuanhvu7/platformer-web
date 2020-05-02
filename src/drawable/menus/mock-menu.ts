import { ResourceUtils } from '../../utils/resource-utils';
import { mainSketch } from '../../main';
import { IDrawable } from '../drawable.interface';
import { platformer } from '../../platformer';
import { IKeyControllable } from '../key-controllable.interface';
import { IMouseControllable } from '../mouse-controllable.interface';

export class MockMenu implements IDrawable, IKeyControllable, IMouseControllable {

  private background: any;
  constructor() {
    this.background = ResourceUtils.DEFAULT_MENU_IMAGE;
    platformer.addToAllDrawables(this);
    platformer.addToAllKeyControllables(this);
    platformer.addToAllMouseControllables(this);
  }

  /**
   * runs continuously; draws background of this
   */
  public draw(): void {
    mainSketch.background(this.background);
  }

  /**
   * runs continuously; draws background of this
   */
  public keyPressed(): void {
    console.log(mainSketch.key);
    console.log(mainSketch.keyCode);
    this.background = 'red';
    setTimeout(
      () => {
        this.background = ResourceUtils.DEFAULT_MENU_IMAGE;
      },
      5000
    );
  }

  public mouseClicked(event: MouseEvent): void {
    console.log(event);
    platformer.deleteFromAllDrawables(this);
    platformer.deleteFromAllKeyControllables(this);
    platformer.deleteFromAllMouseControllables(this);
  }
}
