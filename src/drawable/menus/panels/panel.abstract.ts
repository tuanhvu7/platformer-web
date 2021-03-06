import {
  IDrawable
} from '../../drawable.interface';
import { constants } from '../../../const/constants';
import { mainSketch } from '../../../main';
import { IMouseControllable } from '../../mouse-controllable.interface';
import { platformer } from '../../../platformer';
import { IAPanelProps } from './panel-prop.interfaces';
import { handleDefaultValue } from '../../../utils/common-utils';
/**
 * Common for panels
 */
export abstract class APanel implements IDrawable, IMouseControllable {

  readonly leftX: number;
  readonly rightX: number;

  readonly topY: number;
  readonly bottomY: number;

  panelColor: string;
  panelText: string;

  private readonly width: number;
  private readonly height: number;


  /**
   * set properties of this
   */
  constructor(aPanelProps: IAPanelProps) {
    /** START default values if optional prop(s) not defined */
    const initActive = handleDefaultValue(aPanelProps.initAsActive, true);
    /** END default values if optional prop(s) not defined */

    this.panelText = aPanelProps.panelText;
    this.panelColor = aPanelProps.panelColor;
    this.width = aPanelProps.width;
    this.height = aPanelProps.height;

    this.leftX = aPanelProps.leftX;
    this.rightX = aPanelProps.leftX + aPanelProps.width;

    this.topY = aPanelProps.topY;
    this.bottomY = aPanelProps.topY + aPanelProps.height;

    if (initActive) {
      this.makeActive();
    }
  }

  /**
   * active and add this to game
   */
  makeActive(): void {
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
    platformer.addToAllMouseControllables(this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
    platformer.deleteFromAllMouseControllables(this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * runs continuously; draws rectangle panel using this properties
   */
  public draw(): void {
    mainSketch.fill(this.panelColor);
    mainSketch.rect(this.leftX, this.topY, this.width, this.height);

    mainSketch.fill(0);
    mainSketch.textAlign(mainSketch.CENTER, mainSketch.CENTER);
    mainSketch.textSize(constants.TEXT_SIZE);
    mainSketch.text(this.panelText + '', this.leftX, this.topY, this.width, this.height);
  }

  /**
   * Execute appropriate method (executeWhenClicked) when this is clicked
   */
  public mouseClicked(event: MouseEvent): void {
    if (this.isMouseIn(event)) {
      this.executeWhenClicked();
    }
  }

  /**
   * to execute when this panel is clicked; to override in extended classes
   */
  abstract executeWhenClicked(): void;

  /**
   * return if mouse position inside this panel
   */
  isMouseIn(event: MouseEvent): boolean {
    return event.x > this.leftX &&
      event.x < this.rightX &&
      event.y > this.topY &&
      event.y < this.bottomY;
  }

}