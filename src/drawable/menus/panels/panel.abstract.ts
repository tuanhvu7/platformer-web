import {
  IDrawable
} from '../../drawable.interface';
import { Constants } from '../../../const/constants';
import { mainSketch } from '../../../main';
/**
 * Common for panels
 */
export abstract class APanel implements IDrawable {;

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
  constructor(panelColor: string,
    panelText: string, leftX: number, topY: number, width: number, height: number, isActive: boolean) {

    this.panelText = panelText;
    this.panelColor = panelColor;
    this.width = width;
    this.height = height;

    this.leftX = leftX;
    this.rightX = leftX + width;

    this.topY = topY;
    this.bottomY = topY + height;

    if (isActive) {
      this.makeActive();
    }
  }

  /**
   * active and add this to game
   */
  makeActive(): void {
    mainSketch.registerMethod("draw", this); // connect this draw() from main draw()
    mainSketch.registerMethod("mouseEvent", this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    mainSketch.unregisterMethod("draw", this); // disconnect this draw() from main draw()
    mainSketch.unregisterMethod("mouseEvent", this); // connect this mouseEvent() from main mouseEvent()
  }

  /**
   * runs continuously; draws rectangle panel using this properties
   */
  public draw(): void {
    mainSketch.fill(this.panelColor);
    mainSketch.rect(this.leftX, this.topY, this.width, this.height);

    mainSketch.fill(0);
    mainSketch.textAlign(mainSketch.CENTER, mainSketch.CENTER);
    mainSketch.textSize(Constants.TEXT_SIZE);
    mainSketch.text(this.panelText + "", this.leftX, this.topY, this.width, this.height);
  }

  /**
   * Execute appropriate method (executeWhenClicked) when this is clicked
   */
  public mousePressed(): void {
    if (this.isMouseIn()) {
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
  isMouseIn(): boolean {
    return mainSketch.mouseX > this.leftX &&
      mainSketch.mouseX < this.rightX &&
      mainSketch.mouseY > this.topY &&
      mainSketch.mouseY < this.bottomY;
  }

}