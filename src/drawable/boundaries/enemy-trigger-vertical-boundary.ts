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
   * only one enemy to trigger
   */
  constructor(startXPoint: number, startYPoint: number, y2Offset: number, boundaryLineThickness: number,
              isActive: boolean, enemy: Enemy) {
    super(startXPoint, startYPoint, y2Offset, boundaryLineThickness,
      false, isActive);
    const set: Set<Enemy> = new Set();
    set.add(enemy);
    this.enemiesToAddSet = set;
  }

  /**
   * set properties of this;
   * set of enemies to trigger
   */
  // constructor(int startXPoint, int startYPoint, int y2Offset, int boundaryLineThickness,
  //   boolean isActive, Set < Enemy > enemySet) {
  //   super(startXPoint, startYPoint, y2Offset, boundaryLineThickness,
  //     false, isActive);
  //   this.enemiesToAddSet = enemySet;
  // }

  /**
   * runs continuously. checks and handles contact between this and characters
   */
  public draw(): void {
    this.show();
    if (platformer.getCurrentActivePlayer() != null) {
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