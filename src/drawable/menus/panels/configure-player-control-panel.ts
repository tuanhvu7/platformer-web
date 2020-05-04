import { APanel } from "./panel.abstract";
import { IKeyControllable } from "../../key-controllable.interface";
import { Constants } from "../../../const/constants";
import { platformer } from '../../../platformer';

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
    super(Constants.DEFAULT_PANEL_COLOR, "", leftX, topY, width, height, isActive);
    this.configurablePlayerControlType = configurableControlPanelText;
    switch (this.configurablePlayerControlType) {
      case UP:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerUp());
        break;
      case DOWN:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerDown());
        break;
      case LEFT:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerLeft());
        break;
      case RIGHT:
        this.panelText = this.createFormattedPanelText(PlayerControlSettings.getPlayerRight());
        break;
      default:
        break;
    }
  }

  executeWhenClicked(): void {
    platformer.getChangePlayerControlMenu().resetPanelsColorAndUnregisterKeyEvent();
    this.panelColor = Constants.ALTERNATE_PANEL_COLOR;
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
    const lowercaseKeyCode = String.fromCharCode(mainSketch.keyCode).toLowerCase();
    // check valid input is given (not a reserved or already-taken keyCode)
    if (!ReservedControlUtils.isKeyCodeReserved(lowercaseKeyCode) && PlayerControlSettings.isKeyCodeAvailable(lowercaseKeyCode)) {
      switch (this.configurablePlayerControlType) {
        case UP:
          PlayerControlSettings.setPlayerUp(lowercaseKeyCode);
          break;
        case DOWN:
          PlayerControlSettings.setPlayerDown(lowercaseKeyCode);
          break;
        case LEFT:
          PlayerControlSettings.setPlayerLeft(lowercaseKeyCode);
          break;
        case RIGHT:
          PlayerControlSettings.setPlayerRight(lowercaseKeyCode);
          break;
        default:
          break;
      }
      this.panelText = this.createFormattedPanelText(keyCode);
    }

    // unselect panel after key is inputted; to avoid registerMethod again
    this.resetColorAndUnregisterKeyEvent();
  }

  /**
   * set this to have default panel color and unregister keyEvent
   */
  public resetColorAndUnregisterKeyEvent(): void {
    this.panelColor = Constants.DEFAULT_PANEL_COLOR;
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