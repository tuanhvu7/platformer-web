import { EventBlockTopBoundary } from "./event-block-top-boundary";
import { Vector } from 'p5';
import { platformer } from '../../platformer';
import { HorizontalBoundary } from "./horizontal-boundary";
import { mainSketch } from '../../main';

/**
 * horizontal line boundaries that trigger events
 */
export class EventTriggerHorizontalBoundary extends HorizontalBoundary {
  // top boundary of event block that this is part of
  private readonly eventBlockTopBoundary: EventBlockTopBoundary;

  // if not null, end location of warp event; else, launch event
  private readonly endWarpPosition: Vector;

  // set character vel to this on character contact with this
  private readonly launchEventVerticalVelocity: number;

  /**
   * set properties of this;
   * sets this to have launch event and affect all characters and be invisible
   */
  // constructor(startXPoint: number,
  //             startYPoint: number,
  //             x2Offset: number,
  //             boundaryLineThickness: number,
  //             launchEventVerticalVelocity: number,
  //             isFloorBoundary: boolean,
  //             isActive: boolean,
  //             eventBlockTopBoundary: EventBlockTopBoundary) {
  //   super(startXPoint, startYPoint, x2Offset, boundaryLineThickness,
  //     false, isFloorBoundary, isActive);

  //   this.endWarpPosition = null;
  //   this.isFloorBoundary = isFloorBoundary;
  //   this.eventBlockTopBoundary = eventBlockTopBoundary;
  //   this.launchEventVerticalVelocity = launchEventVerticalVelocity;
  // }

  /**
   * set properties of this;
   * sets this to have warp event and affect all characters and be invisible
   */
  // constructor(startXPoint: number,
  //             startYPoint: number,
  //             x2Offset: number,
  //             boundaryLineThickness: number,
  //             endWarpXPosition: number,
  //             endWarpYPosition: number,
  //             isFloorBoundary: boolean,
  //             isActive: boolean,
  //             eventBlockTopBoundary: EventBlockTopBoundary) {
  //   super(startXPoint, startYPoint, x2Offset, boundaryLineThickness,
  //         false, true, false, isFloorBoundary, isActive);

  //   this.endWarpPosition = mainSketch.createVector(endWarpXPosition, endWarpYPosition);
  //   this.isFloorBoundary = isFloorBoundary;
  //   this.eventBlockTopBoundary = eventBlockTopBoundary;
  //   this.launchEventVerticalVelocity = 0; // this value is not used for warp events
  // }

  /**
   * set properties of this;
   * @param eventProperties determines launch vs warp event
   * eventProperties.length = 1 means launch event and affect all characters and be invisible
   * ventProperties.length = 2 means warp event and affect all characters and be invisible
   */
  constructor(startXPoint: number,
              startYPoint: number,
              x2Offset: number,
              boundaryLineThickness: number,
              eventProperties: number[],
              // endWarpXPosition: number, OR launchEventVerticalVelocity: number,
              // endWarpYPosition: number,
              // isFloorBoundary: boolean,
              isActive: boolean,
    eventBlockTopBoundary: EventBlockTopBoundary) {
    
    super(startXPoint, startYPoint, x2Offset, boundaryLineThickness,
          false, true, false, true, isActive);
    
    if (eventProperties.length === 1) {
      this.endWarpPosition = null;
      this.eventBlockTopBoundary = eventBlockTopBoundary;
      this.launchEventVerticalVelocity = eventProperties[0];
    } else if (eventProperties.length === 2) {
      this.endWarpPosition = mainSketch.createVector(eventProperties[0], eventProperties[1]);
      this.eventBlockTopBoundary = eventBlockTopBoundary;
      this.launchEventVerticalVelocity = 0; // this value is not used for warp events
    }
  }

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