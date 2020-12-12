/**
 * This file contains interfaces for collectable constructors;
 * default values are defined in class implementation
 */

import { IDrawableProps } from "../drawable-props.interface";

export interface IACollectableProps extends IDrawableProps {
  leftX: number;
  topY: number;
  width: number;
  height: number;
  blockLineThickness?: number;  // impl: DEFAULT_BOUNDARY_LINE_THICKNESS if not provided
}

export interface IHealthItemProps extends IACollectableProps {
  healthChangeAmount: number;
}
