import * as p5 from 'p5';
import { Constants } from './const/constants';
import { ResourceUtils } from './utils/resource-utils';
import { IDrawable } from './drawable/drawable.interface';

/**
 * Contains controls for running app
 */
class Platformer {
  public drawable: IDrawable[] = [];

  public sketch = (mainSketch: p5): void => {
    mainSketch.preload = () => {
      ResourceUtils.DEFAULT_MENU_IMAGE = mainSketch.loadImage(ResourceUtils.DEFAULT_MENU_IMAGE_PATH);
    }

    mainSketch.setup = () => {
      mainSketch.createCanvas(Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    };

    mainSketch.draw = () => {
      this.drawable.forEach((curDrawable: IDrawable) => {
        curDrawable.draw();
      });
    }
  }
}

export const platformer = new Platformer();
