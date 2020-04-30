import * as p5 from 'p5';
import { ResourceUtils } from '../../utils/resource-utils';
import { mainSketch } from '../../main';
import { IDrawable } from '../drawable.interface';

export class MockMenu implements IDrawable {

  /**
   * runs continuously; draws background of this
   */
  public draw(): void {
    mainSketch.background(ResourceUtils.DEFAULT_MENU_IMAGE);
  }
}
