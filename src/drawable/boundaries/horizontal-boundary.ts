import { ABoundary } from "./boundary.abstract";
import { platformer } from '../../platformer';
import { ACharacter } from "../characters/character.abstract";
import { IHorizontalBoundaryProps } from './boundary-prop.interfaces';

/**
 * horizontal line boundaries; floors or ceilings
 */
export class HorizontalBoundary extends ABoundary {
  // true means character cannot go through top side of boundary
  // false means character cannot go through bottom side of boundary
  isFloorBoundary: boolean;

  /**
   * set properties of this
   */
  constructor(horizontalBoundaryProps: IHorizontalBoundaryProps) {    
      super({
        x1Point: horizontalBoundaryProps.startXPoint,
        y1Point: horizontalBoundaryProps.startYPoint,
        x2Offset: horizontalBoundaryProps.x2Offset,
        y2Offset: 0,
        boundaryLineThickness: horizontalBoundaryProps.boundaryLineThickness,
        isVisible: horizontalBoundaryProps.isVisible,
        doesAffectPlayer: horizontalBoundaryProps.doesAffectPlayer,
        doesAffectNonPlayers: horizontalBoundaryProps.doesAffectNonPlayers,
        initAsActive: horizontalBoundaryProps.initAsActive
      });

    this.isFloorBoundary = horizontalBoundaryProps.isFloorBoundary;
  }

  /**
   * return true if valid collision with given character
   */
  public contactWithCharacter(character: ACharacter): boolean {

    //        boolean characterWithinXRange =
    //            character.getPos().x > this.startPoint.x - (character.getDiameter() / 2)      // > lower x boundary
    //                && character.getPos().x < this.endPoint.x + (character.getDiameter() / 2);     // < upper x boundary
    //
    //        if (this.isFloorBoundary && character.getVel().y > 0) {
    //            return
    //                characterWithinXRange
    //                    && character.getPos().y < this.startPoint.y                              // center of character above boundary
    //                    && character.getPos().y + (character.getDiameter() / 2) >= this.startPoint.y; // bottom of character 'touching' boundary
    //
    //        } else if (!this.isFloorBoundary && character.getVel().y < 0) {
    //            return
    //                characterWithinXRange
    //                    && character.getPos().y > this.startPoint.y                              // center of character below boundary
    //                    && character.getPos().y - (character.getDiameter() / 2) <= this.startPoint.y; // top of character 'touching' boundary
    //        } else {
    //            return false;
    //        }

    const characterWithinXRange: boolean =
      character.getPos().x > this.startPoint.x - (character.getDiameter() / 2) // > lower x boundary
      &&
      character.getPos().x < this.endPoint.x + (character.getDiameter() / 2); // < upper x boundary

    const alreadyCharacterContact: boolean =
      character.getVel().y === 0 &&
      this.charactersTouchingThis.has(character);

    if (alreadyCharacterContact) {
      return characterWithinXRange;
    }

    const validBoundaryContactVelocity =
      this.isFloorBoundary && character.getVel().y > 0 || !this.isFloorBoundary && character.getVel().y < 0;


    if (validBoundaryContactVelocity) {
      return characterWithinXRange
        &&
        character.getPos().y - (character.getDiameter() / 2) <= this.startPoint.y // top of character contact or in vicinity
        &&
        character.getPos().y + (character.getDiameter() / 2) >= this.startPoint.y; // bottom of character contact or in vicinity
    } else {
      return false;
    }
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();
    if (!curPlayer) return;

    // boundary collision for player
    if (this.contactWithCharacter(curPlayer) && !this.isPreviousContactWithPlayer()) { // this has contact with player
      if (this.doesAffectPlayer) {
        if (!this.charactersTouchingThis.has(curPlayer)) { // new collision detected
          this.charactersTouchingThis.add(curPlayer);
          if (this.isFloorBoundary) {
            curPlayer.changeNumberOfFloorBoundaryContacts(1);
          } else {
            curPlayer.changeNumberOfCeilingBoundaryContacts(1);
          }
        }
        curPlayer.handleContactWithHorizontalBoundary(this.startPoint.y, this.isFloorBoundary);
      } else { // does NOT affect player
        this.setVisible(false);
      }

    } else { // this DOES NOT have contact with player
      if (this.charactersTouchingThis.has(curPlayer)) {
        if (this.isFloorBoundary) {
          if (curPlayer.isShouldSetPreviousFloorBoundaryContact()) {
            curPlayer.setPreviousFloorBoundaryContact(this);
          }
          curPlayer.changeNumberOfFloorBoundaryContacts(-1);
        } else {
          curPlayer.changeNumberOfCeilingBoundaryContacts(-1);
        }
        this.charactersTouchingThis.delete(curPlayer);
      }
    }

  }

  /**
   * check and handle contact with non-player characters
   */
  checkHandleContactWithNonPlayerCharacters(): void {
    if (this.doesAffectNonPlayers) {
      // boundary collision for non-player characters
      platformer.getCurrentActiveLevelDrawableCollection().getCharactersList().forEach((curCharacter: ACharacter) => {
        if (this.contactWithCharacter(curCharacter)) { // this has contact with non-player
          if (this.isFloorBoundary && !this.charactersTouchingThis.has(curCharacter)) { // new collision detected
            curCharacter.changeNumberOfFloorBoundaryContacts(1);
            this.charactersTouchingThis.add(curCharacter);
          }
          curCharacter.handleContactWithHorizontalBoundary(this.startPoint.y, this.isFloorBoundary);

        } else { // this DOES NOT have contact with non-player
          if (this.isFloorBoundary && this.charactersTouchingThis.has(curCharacter)) { // curCharacter no longer colliding with this
            curCharacter.changeNumberOfFloorBoundaryContacts(-1);
            this.charactersTouchingThis.delete(curCharacter);
          }
        }
      });
    }
  }

  /**
   * return if this is previous contact with player
   */
  isPreviousContactWithPlayer(): boolean {
    const curPlayer = platformer.getCurrentActivePlayer();
    return curPlayer?.getPreviousFloorBoundaryContact() === this; // .equals()
  }
}