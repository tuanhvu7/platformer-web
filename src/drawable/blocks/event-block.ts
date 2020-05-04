import { ABlock } from "./block.abstract";
import { Constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { EventBlockTopBoundary } from "../boundaries/event-block-top-boundary";
import { EventTriggerHorizontalBoundary } from "../boundaries/event-trigger-horizontal-boundary";

/**
 * event block;
 */
export class EventBlock extends ABlock {

  // boundary that events player upon player contact
  private readonly eventTriggerBoundary: EventTriggerHorizontalBoundary;

  // set character vel to this on character contact with this.eventTriggerBoundary
  private readonly launchEventVerticalVelocity: number;

  /**
   * Launch event block;
   * set properties of this;
   * affect all characters and be visible
   */
  constructor(leftX: number, topY: number, width: number, height: number, blockLineThickness: number,
    launchEventVerticalVelocity: number,
    isEventTriggerFloorBoundary: boolean, isActive: boolean) {

    super(leftX, topY, width, height, blockLineThickness, false); // initially not active, to be set in makeActive()

    this.fillColor = Constants.EVENT_BLOCK_COLOR;

    this.topSide = new EventBlockTopBoundary(
      leftX,
      topY,
      width,
      blockLineThickness,
      false // initially not active, to be set in makeActive()
    );

    this.launchEventVerticalVelocity = launchEventVerticalVelocity;

    this.eventTriggerBoundary = new EventTriggerHorizontalBoundary(
      leftX + 10,
      topY + height - (height / 5),
      width - 20,
      blockLineThickness,
      this.launchEventVerticalVelocity,
      isEventTriggerFloorBoundary,
      false, // initially not active, to be set in makeActive()
      <EventBlockTopBoundary> this.topSide
    );

    if (isActive) {
      this.makeActive();
    }
  }

  /**
   * Warp event;
   * set properties of this;
   * affect all characters and be visible
   */
  // constructor(int leftX, int topY, int width, int height, int blockLineThickness,
  //   int endWarpXPosition, int endWarpYPosition,
  //   boolean isEventTriggerFloorBoundary, boolean isActive) {

  //   super(leftX, topY, width, height, blockLineThickness, false); // initially not active, to be set in makeActive()

  //   this.fillColor = Constants.EVENT_BLOCK_COLOR;

  //   this.topSide = new EventBlockTopBoundary(
  //     leftX,
  //     topY,
  //     width,
  //     blockLineThickness,
  //     false // initially not active, to be set in makeActive()
  //   );

  //   this.launchEventVerticalVelocity = 0; // this value is not used for warp events

  //   this.eventTriggerBoundary = new EventTriggerHorizontalBoundary(
  //     leftX + 10,
  //     topY + height - (height / 5),
  //     width - 20,
  //     blockLineThickness,
  //     endWarpXPosition,
  //     endWarpYPosition,
  //     isEventTriggerFloorBoundary,
  //     false, // initially not active, to be set in makeActive()
  //     (EventBlockTopBoundary) this.topSide
  //   );

  //   if (isActive) {
  //     this.makeActive();
  //   }
  // }

  /**
   * runs continuously
   */
  public draw(): void {
    if (this.isVisible) {
      this.show();
    }
  }

  /**
   * active and add this to game
   */
  private makeActive(): void {
    platformer.addToAllDrawables(this); // connect this draw() from main draw()

    // make horizontal boundaries first since their detection takes precedence
    this.bottomSide.makeActive();
    this.topSide.makeActive();
    this.leftSide.makeActive();
    this.rightSide.makeActive();
    this.eventTriggerBoundary.makeActive();
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    this.topSide.makeNotActive();
    this.bottomSide.makeNotActive();
    this.leftSide.makeNotActive();
    this.rightSide.makeNotActive();
    this.eventTriggerBoundary.makeNotActive();

    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
  }
}