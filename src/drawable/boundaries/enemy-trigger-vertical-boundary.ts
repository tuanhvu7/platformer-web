import { platformer } from '../../platformer';
import { VerticalBoundary } from './vertical-boundary';
import { Enemy } from '../characters/enemy';
import { IEnemyTriggerVerBoundaryProps } from './boundary-prop.interfaces';
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
  constructor(enemyTriggerVerticalBoundaryProps: IEnemyTriggerVerBoundaryProps) {    
    super({
      startXPoint: enemyTriggerVerticalBoundaryProps.startXPoint,
      startYPoint: enemyTriggerVerticalBoundaryProps.startYPoint,
      y2Offset: enemyTriggerVerticalBoundaryProps.y2Offset,
      boundaryLineThickness: enemyTriggerVerticalBoundaryProps.boundaryLineThickness,
      isVisible: false,
      doesAffectPlayer: true,
      doesAffectNonPlayers: false,
      initAsActive: enemyTriggerVerticalBoundaryProps.initAsActive
    });
    
    const enemyProp = enemyTriggerVerticalBoundaryProps.enemy;
    if (enemyProp instanceof Enemy) {
      const set: Set<Enemy> = new Set();
      set.add(enemyProp);
      this.enemiesToAddSet = set;
    } else {
      this.enemiesToAddSet = enemyProp
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
    if (!curPlayer) return;

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