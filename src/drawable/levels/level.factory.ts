import { ALevel } from './level.abstract';
import { LevelOne } from './level-one';
import { platformer } from '../../platformer';
import { LevelTwo } from './level-two';

/**
 * for creating appropriate level
 */
class LevelFactory {
  /**
   * return appropriate level
   */
  public getLevel(makeActive: boolean, loadPlayerFromCheckPoint: boolean): ALevel {
    switch (platformer.getCurrentActiveLevelNumber()) {
      case 1:
        return new LevelOne(makeActive, loadPlayerFromCheckPoint);

      case 2:
        return new LevelTwo(makeActive, loadPlayerFromCheckPoint);

      // case 3:
      //   return new LevelThree(mainSketch, makeActive, loadPlayerFromCheckPoint);

      default:
        throw new Error('getCurrentActiveLevelNumber() is not valid level value');
    }
  }
}

export const levelFactory = new LevelFactory();