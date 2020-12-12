import { EventBlockTopBoundary } from "./event-block-top-boundary"
import { IWarpEventPos } from '../blocks/block-prop.interfaces';
import { Enemy } from "../characters/enemy";
import { IDrawableProps } from "../drawable-props.interface";

/**
 * This file contains interfaces for boundary constructors;
 * default values are defined in class implementation
 */

export interface IABoundaryProps extends IDrawableProps {
  x1Point: number;
  y1Point: number;
  x2Offset: number;
  y2Offset: number;
  boundaryLineThickness?: number; // impl: DEFAULT_BOUNDARY_LINE_THICKNESS if not provided
  isVisible?: boolean;  // impl: true if not provided
  doesAffectPlayer?: boolean; // impl: true if not provided
  doesAffectNonPlayers?: boolean; // impl: true if not provided
}

/**
 * common properties between horizontal and vertical boundaries
 */
interface ICommonHVBoundaryProps extends IDrawableProps {
  startXPoint: number;
  startYPoint: number;
  boundaryLineThickness?: number; // impl: DEFAULT_BOUNDARY_LINE_THICKNESS if not provided
  isVisible?: boolean;  // impl: true if not provided
  doesAffectPlayer?: boolean; // impl: true if not provided
  doesAffectNonPlayers?: boolean; // impl: true if not provided
}

export interface IVerticalBoundaryProps extends ICommonHVBoundaryProps {
  y2Offset: number;
}

export interface IHorizontalBoundaryProps extends ICommonHVBoundaryProps {
  x2Offset: number;
  isFloorBoundary: boolean;
}

export interface IEnemyTriggerVerBoundaryProps extends IVerticalBoundaryProps {
  enemy: Enemy | Set<Enemy>;
}

export interface IEventTriggerHorBoundaryProps extends IHorizontalBoundaryProps {
  eventBlockTopBoundary: EventBlockTopBoundary;
  
  /** START shared props from EventBlock */
  launchEventVerticalVelocity?: number; // only defined for lauch event;
  warpDestination?: IWarpEventPos; // only defined for warp event
  /** END shared props from EventBlock */
}