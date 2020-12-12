import { ABoundary } from "./boundary.abstract";
import { platformer } from '../../platformer';
import { ACharacter } from "../characters/character.abstract";
import { ControllableEnemy } from "../characters/controllable-enemy";
import { IVerticalBoundaryProps } from './boundary-prop.interfaces';

/**
 * vertical line boundaries; walls
 */
export class VerticalBoundary extends ABoundary {
  /**
   * set properties of this
   */
  constructor(verticalBoundaryProps: IVerticalBoundaryProps) {
    super({
      x1Point: verticalBoundaryProps.startXPoint,
      y1Point: verticalBoundaryProps.startYPoint,
      x2Offset: 0,
      y2Offset: verticalBoundaryProps.y2Offset,
      boundaryLineThickness: verticalBoundaryProps.boundaryLineThickness,
      isVisible: verticalBoundaryProps.isVisible,
      doesAffectPlayer: verticalBoundaryProps.doesAffectPlayer,
      doesAffectNonPlayers: verticalBoundaryProps.doesAffectNonPlayers,
      initAsActive: verticalBoundaryProps.initAsActive
    });
  }

  /**
   * return true if collide with given character
   */
  contactWithCharacter(character: ACharacter): boolean {
    return character.getPos().x + (character.getDiameter() / 2) >= this.startPoint.x // contact right of character
      &&
      character.getPos().x - (character.getDiameter() / 2) <= this.startPoint.x // contact left of character
      &&
      character.getPos().y > this.startPoint.y - (character.getDiameter() / 2) // > top y boundary
      &&
      character.getPos().y < this.endPoint.y + (character.getDiameter() / 2); // < bottom y boundary
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();
    if (!curPlayer) return;

    if (this.doesAffectPlayer) {
      // boundary collision for player
      if (this.contactWithCharacter(curPlayer)) { // this has contact with non-player
        if (!this.charactersTouchingThis.has(curPlayer)) { // new collision detected
          curPlayer.changeNumberOfVerticalBoundaryContacts(1);
          this.charactersTouchingThis.add(curPlayer);
        }
        curPlayer.handleContactWithVerticalBoundary(this.startPoint.x);

      } else { // this DOES NOT have contact with player
        if (this.charactersTouchingThis.has(curPlayer)) {
          curPlayer.setAbleToMoveRight(true);
          curPlayer.setAbleToMoveLeft(true);
          curPlayer.changeNumberOfVerticalBoundaryContacts(-1);
          this.charactersTouchingThis.delete(curPlayer);
        }
      }
    }
  }

  /**
   * check and handle contact with non-player characters
   */
  checkHandleContactWithNonPlayerCharacters(): void {
    if (this.doesAffectNonPlayers) {
      platformer.getCurrentActiveLevelDrawableCollection().getCharactersList().forEach((curCharacter: ACharacter) => {
        if (this.contactWithCharacter(curCharacter)) {
          curCharacter.handleContactWithVerticalBoundary(this.startPoint.x);

        } else if (curCharacter instanceof ControllableEnemy) { // this DOES NOT have contact with character AND character is controllable
          (<ControllableEnemy> curCharacter).setAbleToMoveLeft(true);
          (<ControllableEnemy> curCharacter).setAbleToMoveRight(true);
        }
      });
    }
  }
}