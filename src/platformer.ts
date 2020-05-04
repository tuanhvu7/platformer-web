import p5 from 'p5';
import { Constants } from './const/constants';
import { IDrawable } from './drawable/drawable.interface';
import { IKeyControllable } from './drawable/key-controllable.interface';
import { IMouseControllable } from './drawable/mouse-controllable.interface';
import { MockMenu } from './drawable/menus/mock-menu';
import { ResourceUtils } from './utils/resource-utils';

/**
 * Contains controls for running app
 */
class Platformer {
  private allDrawables: Set<IDrawable> = new Set();
  private allKeyControllables: Set<IKeyControllable> = new Set();
  private allMouseControllables: Set<IMouseControllable> = new Set();

  /**
   * For p5.js
   */
  public sketch = (mainSketch: p5): void => {
    mainSketch.preload = () => {
      ResourceUtils.DEFAULT_MENU_IMAGE = mainSketch.loadImage(ResourceUtils.DEFAULT_MENU_IMAGE_PATH);
    }

    mainSketch.setup = () => {
      mainSketch.createCanvas(Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
      new MockMenu();
    };

    mainSketch.draw = () => {
      this.allDrawables.forEach((curDrawable: IDrawable) => {
        curDrawable.draw();
      });
    }

    mainSketch.keyPressed = () => {
      this.allKeyControllables.forEach((curKeyControllable: IKeyControllable) => {
        curKeyControllable.keyPressed();
      });
    }

    mainSketch.mouseClicked = (event: MouseEvent) => {
      this.allMouseControllables.forEach((curMouseControllable: IMouseControllable) => {
        curMouseControllable.mouseClicked(event);
      });
    }
  }

/** Getters, setters, and field modifiers **/
  
  // Drawables
  public getAllDrawables(): Set<IDrawable> {
    return this.allDrawables;
  }

  public addToAllDrawables(drawable: IDrawable): void {
    this.allDrawables.add(drawable);
  }

  public deleteFromAllDrawables(drawable: IDrawable): void {
    this.allDrawables.delete(drawable);
  }

  // Key Controllables
  public getAllKeyControllables(): Set<IKeyControllable> {
    return this.allKeyControllables;
  }

  public addToAllKeyControllables(keyControllable: IKeyControllable): void {
    this.allKeyControllables.add(keyControllable);
  }

  public deleteFromAllKeyControllables(keyControllable: IKeyControllable): void {
    this.allKeyControllables.delete(keyControllable);
  }

  // Mouse Controllables
  public getAllMouseControllables(): Set<IMouseControllable> {
    return this.allMouseControllables;
  }

  public addToAllMouseControllables(mouseControllable: IMouseControllable): void {
    this.allMouseControllables.add(mouseControllable);
  }

  public deleteFromAllMouseControllables(mouseControllable: IMouseControllable): void {
    this.allMouseControllables.delete(mouseControllable);
  }
}

export const platformer = new Platformer();
