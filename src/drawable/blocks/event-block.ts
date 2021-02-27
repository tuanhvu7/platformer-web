import { ABlock } from "./block.abstract";
import { constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { EventBlockTopBoundary } from "../boundaries/event-block-top-boundary";
import { EventTriggerHorizontalBoundary } from "../boundaries/event-trigger-horizontal-boundary";
import { IEventBlockProps } from "./block-prop.interfaces";
import { handleDefaultValue } from "../../utils/common-utils";

/**
 * event block;
 */
export class EventBlock extends ABlock {

  // boundary that events player upon player contact
  private readonly eventTriggerBoundary: EventTriggerHorizontalBoundary;

  // set character vel to this on character contact with this.eventTriggerBoundary
  private readonly launchEventVerticalVelocity: number;

  /**
   * set properties of this;
   * affect all characters and be visible;
   * 
   * needs to have either launchEventVerticalVelocity or warpDestination
   */
  constructor(eventBlockProps: IEventBlockProps) {
    super(eventBlockProps);
    /** START default values if optional prop(s) not defined */
    const initAsActive = handleDefaultValue(eventBlockProps.initAsActive, true);
    /** END default values if optional prop(s) not defined */

    this.fillColor = constants.EVENT_BLOCK_COLOR;
    
    // pass initAsActive=false to boundary constructors
    // since need this and its boundaries active state to be synced
    this.topSide = new EventBlockTopBoundary({
      startXPoint: eventBlockProps.leftX,
      startYPoint: eventBlockProps.topY,
      x2Offset: eventBlockProps.width,
      boundaryLineThickness: eventBlockProps.blockLineThickness,
      isVisible: true,
      doesAffectPlayer: true,
      doesAffectNonPlayers: true,
      initAsActive: false,
      isFloorBoundary: true // always true
    });

    if (eventBlockProps.launchEventVerticalVelocity) {
      this.launchEventVerticalVelocity = eventBlockProps.launchEventVerticalVelocity;
    } else {
      this.launchEventVerticalVelocity = 0; // this value is not used for warp events
    }

    this.eventTriggerBoundary = new EventTriggerHorizontalBoundary({
      startXPoint: eventBlockProps.leftX + 10,
      startYPoint: eventBlockProps.topY + eventBlockProps.height - (eventBlockProps.height / 5),
      x2Offset: eventBlockProps.width - 20,
      boundaryLineThickness: eventBlockProps.blockLineThickness,
      launchEventVerticalVelocity: eventBlockProps.launchEventVerticalVelocity,
      warpDestination: eventBlockProps.warpDestination,
      isFloorBoundary: eventBlockProps.isEventTriggerFloorBoundary,
      initAsActive: false,
      eventBlockTopBoundary: this.topSide
    });

    if (initAsActive) {
      this.makeActive();
    }
  }

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