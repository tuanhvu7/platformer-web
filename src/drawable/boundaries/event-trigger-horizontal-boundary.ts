import { EventBlockTopBoundary } from "./event-block-top-boundary";
import * as p5 from 'p5';
import { platformer } from '../../platformer';
import { HorizontalBoundary } from "./horizontal-boundary";

/**
 * horizontal line boundaries that trigger events
 */
export class EventTriggerHorizontalBoundary extends HorizontalBoundary {
  // top boundary of event block that this is part of
  private readonly eventBlockTopBoundary: EventBlockTopBoundary;

  // if not null, end location of warp event; else, launch event
  private readonly endWarpPosition: p5.PVector;

  // set character vel to this on character contact with this
  private readonly launchEventVerticalVelocity: number;

  /**
   * set properties of this;
   * sets this to have launch event and affect all characters and be invisible
   */
  constructor(startXPoint: number, startYPoint: number, x2Offset: number,
              boundaryLineThickness: number, launchEventVerticalVelocity: number,
              isFloorBoundary: boolean, isActive: boolean,
              eventBlockTopBoundary: EventBlockTopBoundary) {
    super(startXPoint, startYPoint, x2Offset, boundaryLineThickness,
      false, isFloorBoundary, isActive);

    this.endWarpPosition = null;
    this.isFloorBoundary = isFloorBoundary;
    this.eventBlockTopBoundary = eventBlockTopBoundary;
    this.launchEventVerticalVelocity = launchEventVerticalVelocity;
  }

  /**
   * set properties of this;
   * sets this to have warp event and affect all characters and be invisible
   */
  // constructor(int startXPoint, int startYPoint, int x2Offset, int boundaryLineThickness,
  //   int endWarpXPosition, int endWarpYPosition,
  //   boolean isFloorBoundary, boolean isActive,
  //   EventBlockTopBoundary eventBlockTopBoundary) {
  //   super(startXPoint, startYPoint, x2Offset, boundaryLineThickness,
  //     false, isFloorBoundary, isActive);

  //   this.endWarpPosition = new PVector(endWarpXPosition, endWarpYPosition);
  //   this.isFloorBoundary = isFloorBoundary;
  //   this.eventBlockTopBoundary = eventBlockTopBoundary;
  //   this.launchEventVerticalVelocity = 0; // this value is not used for warp events
  // }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();

    if (this.doesAffectPlayer) {
      // boundary collision for player
      if (this.contactWithCharacter(curPlayer)) { // this has contact with player
        curPlayer.handleContactWithEventBoundary(
          this.eventBlockTopBoundary, this.launchEventVerticalVelocity, this.endWarpPosition);
      }
    }
  }
}