import { EventBlockTopBoundary } from "./event-block-top-boundary";
import { Vector } from 'p5';
import { platformer } from '../../platformer';
import { HorizontalBoundary } from "./horizontal-boundary";
import { mainSketch } from '../../main';
import { IEventTriggerHorBoundaryProps } from "./boundary-prop.interfaces";

/**
 * horizontal line boundaries that trigger events;
 * if both launch and warp configs are provided, then launch configs are used (warp configs are ignored)
 */
export class EventTriggerHorizontalBoundary extends HorizontalBoundary {
  // top boundary of event block that this is part of
  private readonly eventBlockTopBoundary: EventBlockTopBoundary;

  // if not null, end location of warp event; else, launch event
  private readonly endWarpPosition: Vector | null;

  // set character vel to this on character contact with this
  private readonly launchEventVerticalVelocity: number;

  /**
   * set properties of this
   */
  constructor(eventTriggerHorBoundaryProps: IEventTriggerHorBoundaryProps) {
    super({
      startXPoint: eventTriggerHorBoundaryProps.startXPoint,
      startYPoint: eventTriggerHorBoundaryProps.startYPoint,
      x2Offset: eventTriggerHorBoundaryProps.x2Offset,
      boundaryLineThickness: eventTriggerHorBoundaryProps.boundaryLineThickness,
      isVisible: false,
      doesAffectPlayer: true,
      doesAffectNonPlayers: false,
      isFloorBoundary: eventTriggerHorBoundaryProps.isFloorBoundary,
      initAsActive: eventTriggerHorBoundaryProps.initAsActive
    });
    
    this.eventBlockTopBoundary = eventTriggerHorBoundaryProps.eventBlockTopBoundary;
    if (eventTriggerHorBoundaryProps.launchEventVerticalVelocity) {
      this.endWarpPosition = null;      
      this.launchEventVerticalVelocity = eventTriggerHorBoundaryProps.launchEventVerticalVelocity;
    } else if (eventTriggerHorBoundaryProps.warpDestination) {
      this.endWarpPosition = mainSketch.createVector(
        eventTriggerHorBoundaryProps.warpDestination.x,
        eventTriggerHorBoundaryProps.warpDestination.y
      );
      this.launchEventVerticalVelocity = 0; // this value is not used for warp events
    } else {
      throw new Error('Event trigger horizontal boundary must be either a launch or warp event');
    }
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();
    if (!curPlayer) return;

    if (this.doesAffectPlayer) {
      // boundary collision for player
      if (this.contactWithCharacter(curPlayer)) { // this has contact with player
        curPlayer.handleContactWithEventBoundary(
          this.eventBlockTopBoundary, this.launchEventVerticalVelocity, this.endWarpPosition);
      }
    }
  }
}