import { platformer } from '../../platformer';
import { HorizontalBoundary } from './horizontal-boundary';
/**
 * top horizontal line boundaries of event blocks;
 * player can descend down this
 */
export class EventBlockTopBoundary extends HorizontalBoundary {
  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  // constructor(startXPoint: number,
  //             startYPoint: number,
  //             x2Offset: number,
  //             boundaryLineThickness: number,
  //             isActive: boolean) {
  //   super(startXPoint, startYPoint, x2Offset, boundaryLineThickness, true, isActive);
  // }

  /**
   * set properties of this
   * sets this to affect all characters
   */
  // constructor(startXPoint: number,
  //             startYPoint: number,
  //             x2Offset: number,
  //             boundaryLineThickness: number,
  //             isVisible: boolean,
  //             isActive: boolean) {
  //   super(startXPoint, startYPoint, x2Offset, boundaryLineThickness, isVisible, true, isActive);
  // }

  /**
   * set properties of this
   */
  constructor(startXPoint: number,
              startYPoint: number,
              x2Offset: number,
              boundaryLineThickness: number,
              isVisible: boolean,
              doesAffectPlayer: boolean,
              doesAffectNonPlayers: boolean,
              isActive: boolean) {
    super(startXPoint, startYPoint, x2Offset, boundaryLineThickness,
      isVisible, doesAffectPlayer, doesAffectNonPlayers,
      true, isActive);
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();
    if (this.doesAffectPlayer) {
      // boundary collision for player
      if (this.contactWithCharacter(curPlayer) && !this.isPreviousContactWithPlayer()) { // this has contact with player
        if (!curPlayer.getEventBlockTopBoundaryContacts().has(this)
            && !this.charactersTouchingThis.has(curPlayer)) { // new collision detected
          curPlayer.getEventBlockTopBoundaryContacts().add(this);
          this.charactersTouchingThis.add(curPlayer);
          curPlayer.changeNumberOfFloorBoundaryContacts(1);
        }
        curPlayer.handleContactWithHorizontalBoundary(this.startPoint.y, true);

      } else { // this DOES NOT have contact with player
        if (curPlayer.getEventBlockTopBoundaryContacts().has(this)
            && this.charactersTouchingThis.has(curPlayer)) {
          if (curPlayer.isShouldSetPreviousFloorBoundaryContact()) {
            curPlayer.setPreviousFloorBoundaryContact(this);
          }
          curPlayer.changeNumberOfFloorBoundaryContacts(-1);
          curPlayer.getEventBlockTopBoundaryContacts().delete(this);
          this.charactersTouchingThis.delete(curPlayer);
        }
      }
    }
  }
}