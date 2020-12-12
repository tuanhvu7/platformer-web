/**
 * This file contains interfaces for character constructors;
 * default values are defined in class implementation
 */

import { IDrawableProps } from "../drawable-props.interface";

export interface IACharacterProps extends IDrawableProps {
  x: number;
  y: number;
  diameter: number;
}

export interface IPlayerProps extends IACharacterProps {
  health: number;
}

export interface IEnemyProps extends IACharacterProps {
  horizontalVel: number;
  isInvulnerable?: boolean; // impl: set to false if not provided
  isVisible?: boolean; // impl: set to true if not provided
}

export interface IControllableEnemyProps extends IEnemyProps {
  isJumpControllable: boolean;
  isHorizontalControllable: boolean;
}

export interface IFlyingEnemyProps extends IEnemyProps {
  verticalVel: number;
  isAffectedByHorizontalBoundaries: boolean;
  isAffectedByVerticalBoundaries: boolean;
  topYLimit?: number; // impl: set to upper y limit of level if not provided
  bottomYLimit?: number; // impl: set to bototm y limit of level if not provided
}
