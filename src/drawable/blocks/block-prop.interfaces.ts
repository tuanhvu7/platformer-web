import { ACollectable } from '../collectables/collectable.abstract';
import { IDrawableProps } from '../drawable-props.interface';

/**
 * This file contains interfaces for block constructors;
 * default values are defined in class implementation
 */

export interface IABlockProps {
  leftX: number;
  topY: number;
  width: number;
  height: number;
  blockLineThickness?: number; // impl: set to DEFAULT_BOUNDARY_LINE_THICKNESS if not provided
  isVisible?: boolean; // impl: set to true if not provided
}

export interface IBlockProps extends IDrawableProps, IABlockProps {
  isBreakableFromBottom?: boolean; // impl: set to false if not provided
}

/*** START event block schema */

interface IEventBlockPropsBase extends IBlockProps {
  isEventTriggerFloorBoundary: boolean; // floor vs ceiling event trigger boundary
}

interface ILaunchEventProps extends IEventBlockPropsBase {
  // launchEventVerticalVelocity should only be defined for lauch event;
  // it takes precedence over warpDestination
  launchEventVerticalVelocity: number; 
  warpDestination?: never;
}

interface IWarpEventProps extends IEventBlockPropsBase {
  // warpDestination should only be defined for warp event
  warpDestination: IWarpEventPos; 
  launchEventVerticalVelocity?: never;
}

export interface IWarpEventPos {
  x: number;
  y: number;
}

export type IEventBlockProps = ILaunchEventProps | IWarpEventProps;

/*** END event block schema */

export interface IItemBlockProps extends IBlockProps {
  item: ACollectable;
}