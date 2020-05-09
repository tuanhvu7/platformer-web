import { APanel } from "./panel.abstract";
import { IKeyControllable } from "../../key-controllable.interface";
import { constants } from "../../../const/constants";
import { platformer } from '../../../platformer';
import { EConfigurablePlayerControls } from "../../../enums/configurable-player-controls.enum";
import { PlayerControlSettings } from "../../../utils/player-control-settings";
import { mainSketch } from "../../../main";
import { ReservedControlUtils } from "../../../utils/reserved-control-utils";

/**
 * Used to display and change player control settings
 */
export class ConfigurePlayerControlPanel extends APanel implements IKeyControllable {
  // player control type linked to this
  private readonly configurablePlayerControlType: EConfigurablePlayerControls;

  /**
   * set properties of this
   */
  constructor(configurableControlPanelText: EConfigurablePlayerControls,
    leftX: number, topY: number, width: number, height: number, isActive: boolean) {
    super(constants.DEFAULT_PANEL_COLOR, "", leftX, topY, width, height, isActive);
    this.configurablePlayerControlType = configurableControlPanelText;
    switch (this.configurablePlayerControlType) {
      case EConfigurablePlayerControls.UP:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerUp());
        break;
      case EConfigurablePlayerControls.DOWN:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerDown());
        break;
      case EConfigurablePlayerControls.LEFT:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerLeft());
        break;
      case EConfigurablePlayerControls.RIGHT:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerRight());
        break;
      default:
        break;
    }
  }

  executeWhenClicked(): void {
    platformer.getChangePlayerControlMenu().resetPanelsColorAndUnregisterKeyEvent();
    this.panelColor = constants.ALTERNATE_PANEL_COLOR;
    platformer.addToAllKeyControllables(this);
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
    platformer.deleteFromAllKeyControllables(this); // disconnect this mouseEvent() from main mouseEvent()
    platformer.deleteFromAllMouseControllables(this); // disconnect this keyEvent() from main keyEvent()
  }

  /**
   * handle panel keypress controls
   */
  public keyPressed(): void {
    const lowercaseKey = String.fromCharCode(mainSketch.keyCode).toLowerCase();
    // check valid input is given (not a reserved or already-taken keyCode)
    if (!ReservedControlUtils.isKeyCodeReserved(lowercaseKey) && PlayerControlSettings.isKeyAvailable(lowercaseKey)) {
      switch (this.configurablePlayerControlType) {
        case EConfigurablePlayerControls.UP:
          PlayerControlSettings.setPlayerUp(lowercaseKey);
          break;
        case EConfigurablePlayerControls.DOWN:
          PlayerControlSettings.setPlayerDown(lowercaseKey);
          break;
        case EConfigurablePlayerControls.LEFT:
          PlayerControlSettings.setPlayerLeft(lowercaseKey);
          break;
        case EConfigurablePlayerControls.RIGHT:
          PlayerControlSettings.setPlayerRight(lowercaseKey);
          break;
        default:
          break;
      }
      this.panelText = this.createFormattedPanelText(lowercaseKey);
    }

    // unselect panel after key is inputted; to avoid registerMethod again
    this.resetColorAndUnregisterKeyEvent();
  }

  /**
   * set this to have default panel color and unregister keyEvent
   */
  public resetColorAndUnregisterKeyEvent(): void {
    this.panelColor = constants.DEFAULT_PANEL_COLOR;
    platformer.deleteFromAllKeyControllables(this);  // disconnect this keyEvent() from main keyEvent()
  }

  /**
   * @return formatted panel text that contains player control type and player control key
   */
  private createFormattedPanelText(playerControlKey: string): string {
    playerControlKey = playerControlKey.toLowerCase();
    let finalPlayerControlKeyText;
    // const playerControlKeyStr = (char) playerControlKey + "";
    // to handle display of up, down, left, right arrows text
    switch (playerControlKey) {
      case 'arrowup':
        finalPlayerControlKeyText = "UP";
        break;
      case 'arrowdown':
        finalPlayerControlKeyText = "DOWN";
        break;
      case 'arrowleft':
        finalPlayerControlKeyText = "LEFT";
        break;
      case 'arrowright':
        finalPlayerControlKeyText = "RIGHT";
        break;
    }

    return this.configurablePlayerControlType.toString() + ": " + finalPlayerControlKeyText;
  }
}