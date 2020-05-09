import { platformer } from '../../platformer';
import { VerticalBoundary } from './vertical-boundary';
import { Enemy } from '../characters/enemy';
/**
 * boundary to add enemies upon player contact
 */
export class EnemyTriggerVerticalBoundary extends VerticalBoundary {
  // set of enemies to be added
  private readonly enemiesToAddSet: Set<Enemy>;

  /**
   * set properties of this;
   * @param enemy can be 1 enemy or set of enemies to add
   */
  constructor(startXPoint: number, startYPoint: number, y2Offset: number, boundaryLineThickness: number,
              isActive: boolean, enemy: Enemy  | Set<Enemy>) {
    super(startXPoint, startYPoint, y2Offset, boundaryLineThickness,
          false, true, false, isActive);
    if (enemy instanceof Enemy) {
      const set: Set<Enemy> = new Set();
      set.add(enemy);
      this.enemiesToAddSet = set;
    } else {
      this.enemiesToAddSet = enemy
    }
  }

  /**
   * runs continuously. checks and handles contact between this and characters
   */
  public draw(): void {
    this.show();
    if (platformer.getCurrentActivePlayer()) {
      this.checkHandleContactWithPlayer();
    }
  }

  /**
   * check and handle contact with player
   */
  checkHandleContactWithPlayer(): void {
    const curPlayer = platformer.getCurrentActivePlayer();

    if (this.doesAffectPlayer) {
      // boundary collision for player
      if (this.contactWithCharacter(curPlayer)) { // this has contact with non-player
        this.enemiesToAddSet.forEach((curEnemy: Enemy) => {
          curEnemy.makeActive();
        });
        this.makeNotActive();
      }
    }
  }
}