import { IDrawable } from "../drawable.interface";
import { mainSketch } from '../../main';
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { VerticalBoundary } from "../boundaries/vertical-boundary";

/**
 * common for blocks
 */
export abstract class ABlock implements IDrawable {

  isVisible: boolean;

  fillColor: string;

  // position and dimensions
  readonly leftX: number;
  readonly topY: number;
  readonly width: number;
  readonly height: number;

  // boundaries that make up block
  topSide: HorizontalBoundary;
  readonly bottomSide: HorizontalBoundary;

  readonly leftSide: VerticalBoundary;
  readonly rightSide: VerticalBoundary;

  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  // constructor(leftX: number,
  //             topY: number,
  //             width: number,
  //             height: number,
  //             blockLineThickness: number,
  //             isActive: boolean) {

  //   this.leftX = leftX;
  //   this.topY = topY;
  //   this.width = width;
  //   this.height = height;

  //   this.isVisible = true;

  //   this.bottomSide = new HorizontalBoundary(
  //     leftX,
  //     topY + height,
  //     width,
  //     blockLineThickness,
  //     true,
  //     true,
  //     true,
  //     false,
  //     isActive
  //   );

  //   this.leftSide = new VerticalBoundary(
  //     leftX,
  //     topY + 1,
  //     height - 2,
  //     blockLineThickness,
  //     isActive
  //   );

  //   this.rightSide = new VerticalBoundary(
  //     leftX + width,
  //     topY + 1,
  //     height - 2,
  //     blockLineThickness,
  //     isActive
  //   );
  // }

  /**
   * set properties of this;
   * sets this to be active for all characters;
   * if given isVisible is false, only bottom boundary of block is active
   * to all characters
   */
  constructor(leftX: number,
              topY: number,
              width: number,
              height: number,
              blockLineThickness: number,
              isVisible: boolean,
              isActive: boolean) {

    this.leftX = leftX;
    this.topY = topY;
    this.width = width;
    this.height = height;

    this.isVisible = isVisible;

    this.bottomSide = new HorizontalBoundary(
      leftX + 1,
      topY + height,
      width - 1,
      blockLineThickness,
      isVisible,
      true,
      true,
      false,
      isActive
    );

    this.leftSide = new VerticalBoundary(
      leftX,
      topY,
      height,
      blockLineThickness,
      isVisible,
      true,
      true,
      isActive
    );

    this.rightSide = new VerticalBoundary(
      leftX + width,
      topY,
      height,
      blockLineThickness,
      isVisible,
      true,
      true,
      isActive
    );
  }

  public abstract draw(): void;

  /**
   * display block
   */
  show(): void {
    mainSketch.fill(this.fillColor);
    mainSketch.rect(this.leftX, this.topY, this.width, this.height);
  }

  /**
   * deactivate and remove this from game;
   * to override in extended classes
   */
  public abstract makeNotActive(): void;
}