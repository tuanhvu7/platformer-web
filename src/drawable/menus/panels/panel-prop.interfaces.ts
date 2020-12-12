/**
 * This file contains interfaces for panel constructors;
 * default values are defined in class implementation
 */

import { EConfigurablePlayerControls } from "../../../enums/configurable-player-controls.enum";
import { EPauseMenuButtonType } from "../../../enums/pause-menu-button-type.enum";
import { IDrawableProps } from '../../drawable-props.interface';

interface IPanelProps extends IDrawableProps {
  leftX: number;
  topY: number;
  width: number;
  height: number;
}

export interface IAPanelProps extends IPanelProps {
  panelColor: string;
  panelText: string;
  leftX: number;
}

export interface ILevelSelectMenuPanelProps extends IPanelProps {
  panelLevel: number;
}

export interface IConfigPlayerControlPanelProps extends IPanelProps {
  configControlPanelControls: EConfigurablePlayerControls
}

export interface IPauseMenuPanelProps extends IPanelProps {
  panelType: EPauseMenuButtonType,
  horizontalOffset: number, 
}
