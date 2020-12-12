import { platformer } from '../../platformer';
import { IHorizontalBoundaryProps } from './boundary-prop.interfaces';
import { HorizontalBoundary } from './horizontal-boundary';
/**
 * top horizontal line boundaries of event blocks;
 * player can descend down this
 */
export class EventBlockTopBoundary extends HorizontalBoundary {
  /**
   * set properties of this
   */
  constructor(eventBlockTopBoundary: IHorizontalBoundaryProps) {    
      super({
        startXPoint: eventBlockTopBoundary.startXPoint,
        startYPoint: eventBlockTopBoundary.startYPoint,
        x2Offset: eventBlockTopBoundary.x2Offset,
        isFloorBoundary: true,
        boundaryLineThickness: eventBlockTopBoundary.boundaryLineThickness, 
        isVisible: eventBlockTopBoundary.isVisible,
        doesAffectPlayer: eventBlockTopBoundary.doesAffectPlayer,
        doesAffectNonPlayers: eventBlockTopBoundary.doesAffectNonPlayers,
        initAsActive: eventBlockTopBoundary.initAsActive 
      });
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();
    if (!curPlayer) return;
    
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