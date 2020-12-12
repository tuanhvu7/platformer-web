import { IDrawable } from "../drawable.interface";
import { mainSketch } from '../../main';
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { VerticalBoundary } from "../boundaries/vertical-boundary";
import { IABlockProps } from "./block-prop.interfaces";
import { constants } from "../../const/constants";
import { handleDefaultValue } from "../../utils/ccommon-utils";

/**
 * common for blocks
 */
export abstract class ABlock implements IDrawable {

  isVisible: boolean;

  fillColor: string = constants.DEFAULT_BLOCK_COLOR;

  // position and dimensions
  readonly leftX: number;
  readonly topY: number;
  readonly width: number;
  readonly height: number;

  // boundaries that make up block
  topSide!: HorizontalBoundary;
  readonly bottomSide: HorizontalBoundary;

  readonly leftSide: VerticalBoundary;
  readonly rightSide: VerticalBoundary;

  /**
   * set properties of this;
   * if given isVisible is false, only bottom boundary of block is active
   * to all characters
   */
  constructor(ablockProps: IABlockProps) {
    /** START default values if optional prop(s) not defined */
    this.isVisible = handleDefaultValue(ablockProps.isVisible, true);
    const blockLineThickness = handleDefaultValue(
      ablockProps.blockLineThickness,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS
    );
    /** END default values if optional prop(s) not defined */
    
    this.leftX = ablockProps.leftX;
    this.topY = ablockProps.topY;
    this.width = ablockProps.width;
    this.height = ablockProps.height;

    // pass initAsActive=false to boundary constructors
    // since need this and its boundaries active state to be synced
    this.bottomSide = new HorizontalBoundary({
      startXPoint: ablockProps.leftX + 1,
      startYPoint: ablockProps.topY + ablockProps.height,
      x2Offset: ablockProps.width - 1,
      boundaryLineThickness: blockLineThickness,
      isVisible: this.isVisible,
      doesAffectPlayer: true,
      doesAffectNonPlayers: true,
      isFloorBoundary: false,
      initAsActive: false
    });

    this.leftSide = new VerticalBoundary({
      startXPoint: ablockProps.leftX,
      startYPoint: ablockProps.topY,
      y2Offset: ablockProps.height,
      boundaryLineThickness: blockLineThickness,
      isVisible: this.isVisible, 
      doesAffectPlayer: true, 
      doesAffectNonPlayers: true,
      initAsActive: false
    });

    this.rightSide = new VerticalBoundary({
      startXPoint: ablockProps.leftX + ablockProps.width,
      startYPoint: ablockProps.topY,
      y2Offset: ablockProps.height,
      boundaryLineThickness: blockLineThickness,
      isVisible: this.isVisible, 
      doesAffectPlayer: true, 
      doesAffectNonPlayers: true,
      initAsActive: false
    });
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