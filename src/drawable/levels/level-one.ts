import { ALevel } from "./level.abstract";
import { Constants } from "../../const/constants";
import { ResourceUtils } from "../../utils/resource-utils";
import { mainSketch } from '../../main';
import { Player } from "../characters/player";
import { Checkpoint } from "../collectables/checkpoint";
import { Enemy } from "../characters/enemy";
import { EnemyTriggerVerticalBoundary } from "../boundaries/enemy-trigger-vertical-boundary";
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { Block } from "../blocks/block";
import { EventBlock } from "../blocks/event-block";
import { ControllableEnemy } from "../characters/controllable-enemy";
import { FlyingEnemy } from "../characters/flying-enemy";
import { platformer } from '../../platformer';
import { ViewBox } from "../viewbox/viewbox";
import { ESongType } from "../../enums/song-type.enum";

/**
 * Level one
 */
export class LevelOne extends ALevel {

  // true means big enemy trigger boundary has been activated
  private bigEnemyTriggerActivated: boolean;
  // size of this characters list to make big enemy trigger boundary active
  private bigEnemyTriggerCharacterListSizeCondition: number;

  /**
   * sets properties, boundaries, and characters of this
   */
  constructor(isActive: boolean, loadPlayerFromCheckPoint: boolean) {
      super(isActive, loadPlayerFromCheckPoint, Constants.BIG_ENEMY_DIAMETER + 200);
  }

  /**
   * setup and activate this
   */
  public setUpActivateLevel(): void {
      this.bigEnemyTriggerActivated = false;
      this.checkpointXPos = 3100;

      this.makeActive();
      ResourceUtils.loopSong(ESongType.LEVEL);

      if (this.loadPlayerFromCheckPoint) {
          this.viewBox = new ViewBox(this.checkpointXPos - 200, 0, true);
          this.player = new Player(this.checkpointXPos, 0, Constants.PLAYER_DIAMETER, true);
      } else {
          this.viewBox = new ViewBox(0, 0, true);
          this.player = new Player(200, 0, Constants.PLAYER_DIAMETER, true);

          this.levelDrawableCollection.addDrawable(new Checkpoint(
              this.checkpointXPos,
              Constants.LEVEL_FLOOR_Y_POSITION - Constants.CHECKPOINT_HEIGHT,
              Constants.CHECKPOINT_WIDTH,
              Constants.CHECKPOINT_HEIGHT,
              Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
              true)
          );
      }

      let levelFloorXPosReference: number = this.setupActivateBeforeCheckpoint();
      levelFloorXPosReference = this.setupActivateMiddleSectionAfterCheckpoint(levelFloorXPosReference + 500);
      this.setupActivateEndSection(levelFloorXPosReference);

      this.bigEnemyTriggerCharacterListSizeCondition
          = this.levelDrawableCollection.getCharactersList().size - 2;
  }

  /**
   * handle conditional enemy triggers in this;
   * to override in extended classes
   */
  public handleConditionalEnemyTriggers(): void {
      if (!this.bigEnemyTriggerActivated
          && this.levelDrawableCollection.getCharactersList().size == this.bigEnemyTriggerCharacterListSizeCondition) {

          const triggerEnemy: Enemy = new Enemy(
              3000,
              0,
              Constants.BIG_ENEMY_DIAMETER,
              -Constants.ENEMY_REGULAR_MOVEMENT_SPEED,
              false,
              true,
              false
          );
          this.levelDrawableCollection.addDrawable(triggerEnemy);

          this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
              2900,
              0,
              Constants.LEVEL_FLOOR_Y_POSITION,
              Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
              true,
              triggerEnemy
          ));

          this.bigEnemyTriggerActivated = true;
      }
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateBeforeCheckpoint(): number {
      const sectionFloorXOffset = 2500;
      // stage floor
      this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
          0,
          Constants.LEVEL_FLOOR_Y_POSITION,
          sectionFloorXOffset,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          true
      ));

      this.levelDrawableCollection.addDrawable(new Enemy(
          500,
          0,
          Constants.BIG_ENEMY_DIAMETER,
          -Constants.ENEMY_REGULAR_MOVEMENT_SPEED,
          false,
          true,
          true)
      );

      this.levelDrawableCollection.addDrawable(new Block(
          750,
          mainSketch.height - 300 - Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          true
      ));

      this.levelDrawableCollection.addDrawable(new Enemy(
          1750,
          0,
          Constants.SMALL_ENEMY_DIAMETER,
          -Constants.ENEMY_SLOW_MOVEMENT_SPEED,
          false,
          true,
          true)
      );
      this.levelDrawableCollection.addDrawable(new Enemy(
          1750 + Constants.SMALL_ENEMY_DIAMETER,
          0,
          Constants.SMALL_ENEMY_DIAMETER,
          -Constants.ENEMY_SLOW_MOVEMENT_SPEED,
          false,
          true,
          true)
      );
      this.levelDrawableCollection.addDrawable(new Enemy(
          1750 + 2 * Constants.SMALL_ENEMY_DIAMETER,
          0,
          Constants.SMALL_ENEMY_DIAMETER,
          -Constants.ENEMY_SLOW_MOVEMENT_SPEED,
          false,
          true,
          true)
      );
      this.levelDrawableCollection.addDrawable(new Enemy(
          1750 + 3 * Constants.SMALL_ENEMY_DIAMETER,
          0,
          Constants.SMALL_ENEMY_DIAMETER,
          -Constants.ENEMY_SLOW_MOVEMENT_SPEED,
          false,
          true,
          true)
      );
      this.levelDrawableCollection.addDrawable(new Enemy(
          1750 + 4 * Constants.SMALL_ENEMY_DIAMETER,
          0,
          Constants.SMALL_ENEMY_DIAMETER,
          -Constants.ENEMY_SLOW_MOVEMENT_SPEED,
          false,
          true,
          true)
      );
      this.levelDrawableCollection.addDrawable(new Enemy(
          1750 + 5 * Constants.SMALL_ENEMY_DIAMETER,
          0,
          Constants.SMALL_ENEMY_DIAMETER,
          -Constants.ENEMY_SLOW_MOVEMENT_SPEED,
          false,
          true,
          true)
      );
      this.levelDrawableCollection.addDrawable(new Enemy(
          1750 + 6 * Constants.SMALL_ENEMY_DIAMETER,
          0,
          Constants.SMALL_ENEMY_DIAMETER,
          -Constants.ENEMY_SLOW_MOVEMENT_SPEED,
          false,
          true,
          true)
      );

      this.levelDrawableCollection.addDrawable(new EventBlock( // launch event
          2000,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          Constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY,
          true,
          true
      ));

      const playerWarpEndXPos = 2800;
      this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
          2000 + Constants.DEFAULT_EVENT_BLOCK_WIDTH + Constants.PLAYER_DIAMETER + 100,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          playerWarpEndXPos,
          750,
          true,
          true
      ));

      this.levelDrawableCollection.addDrawable(new Block(
          2550,
          Constants.LEVEL_FLOOR_Y_POSITION - 300 - Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          false,
          false,
          true
      ));

      return sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateMiddleSectionAfterCheckpoint(startXPos: number): number {
      const sectionFloorXOffset = 2000;
      // stage floor
      this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
          startXPos,
          Constants.LEVEL_FLOOR_Y_POSITION,
          sectionFloorXOffset,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          true
      ));

      this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
          startXPos + 250,
          Constants.LEVEL_FLOOR_Y_POSITION - 4 * Constants.PLAYER_DIAMETER,
          4 * Constants.PLAYER_DIAMETER,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          true
      ));

      // controllable enemy
      let enemyToAdd: Enemy = new ControllableEnemy(
          startXPos + 1000 + 4 * Constants.PLAYER_DIAMETER,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.SMALL_ENEMY_DIAMETER - 10,
          Constants.SMALL_ENEMY_DIAMETER,
          true,
          false,
          -Constants.ENEMY_FAST_MOVEMENT_SPEED,
          false,
          true,
          false
      );
      this.levelDrawableCollection.addDrawable(enemyToAdd);
      this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
          startXPos + 500 + 4 * Constants.PLAYER_DIAMETER,
          0,
          Constants.LEVEL_FLOOR_Y_POSITION,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          enemyToAdd
      ));

      // flying enemies
      const triggerEnemySet: Set<Enemy> = new Set();
      for (let i = 1; i <= 2; i++) {
          enemyToAdd = new FlyingEnemy(
              startXPos + 1600 + (4 * i) * Constants.PLAYER_DIAMETER,
              Constants.LEVEL_FLOOR_Y_POSITION - (2 + 2 * i) * Constants.PLAYER_DIAMETER,
              Constants.SMALL_ENEMY_DIAMETER,
              -Constants.ENEMY_FAST_MOVEMENT_SPEED,
              0,
              false,
              false,
              false,
              true,
              false);
          triggerEnemySet.add(enemyToAdd);
          this.levelDrawableCollection.addDrawable(enemyToAdd);
      }

      enemyToAdd = new FlyingEnemy(
          startXPos + 1600 + 14 * Constants.PLAYER_DIAMETER,
          Constants.LEVEL_FLOOR_Y_POSITION - 5 * Constants.PLAYER_DIAMETER,
          Constants.BIG_ENEMY_DIAMETER,
          -Constants.ENEMY_FAST_MOVEMENT_SPEED,
          0,
          false,
          false,
          false,
          true,
          false);
      triggerEnemySet.add(enemyToAdd);
      this.levelDrawableCollection.addDrawable(enemyToAdd);

      this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
          startXPos + 1100 + 4 * Constants.PLAYER_DIAMETER,
          0,
          Constants.LEVEL_FLOOR_Y_POSITION,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          triggerEnemySet
      ));

      return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndSection(startXPos: number): void {
      this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
          startXPos,
          platformer.getCurrentActiveLevelHeight(),
          250,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          true,
          false,
          true,
          true
      ));
      this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
          startXPos + 250,
          Constants.LEVEL_FLOOR_Y_POSITION,
          250,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          false,
          false,
          true,
          true
      ));

      const endStageFloorPosition = startXPos + 500;
      // stage floor
      this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
          endStageFloorPosition,
          Constants.LEVEL_FLOOR_Y_POSITION,
          platformer.getCurrentActiveLevelWidth() - startXPos,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          true
      ));

      // event block with invincible enemy
      const eventBlockInvulnerableEnemyXReference = endStageFloorPosition + 300;
      this.levelDrawableCollection.addDrawable(new EventBlock( // launch event
          eventBlockInvulnerableEnemyXReference,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          Constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY,
          true,
          true
      ));
      this.levelDrawableCollection.addDrawable(new Enemy(
          eventBlockInvulnerableEnemyXReference + (Constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT - Constants.SMALL_ENEMY_DIAMETER,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          0,
          true,
          false,
          true
      ));

      /*** START two event blocks trap ***/
      const eventBlockGoingToTrapXReference = endStageFloorPosition + 750;
      const eventBlockTrapXReference = endStageFloorPosition + 2000;
      this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
          eventBlockGoingToTrapXReference,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          eventBlockTrapXReference + (Constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT + Constants.SMALL_ENEMY_DIAMETER,
          true,
          true
      ));

      this.levelDrawableCollection.addDrawable(new Block(  // block left of event block trap
          eventBlockTrapXReference - Constants.DEFAULT_BLOCK_SIZE,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * Constants.PLAYER_DIAMETER),
          Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT + (4 * Constants.PLAYER_DIAMETER),
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          false,
          true
      ));
      this.levelDrawableCollection.addDrawable(new Block(  // block above event block trap
          eventBlockTrapXReference,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * Constants.PLAYER_DIAMETER),
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          false,
          true
      ));
      this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
          eventBlockTrapXReference,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          eventBlockInvulnerableEnemyXReference + (Constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT + Constants.SMALL_ENEMY_DIAMETER,
          true,
          true
      ));
      this.levelDrawableCollection.addDrawable(new Block(  // block right of event block trap
          eventBlockTrapXReference + Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * Constants.PLAYER_DIAMETER),
          Constants.DEFAULT_BLOCK_SIZE,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT + (4 * Constants.PLAYER_DIAMETER),
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          false,
          true
      ));
      /*** END two event blocks trap ***/


      /*** START two event blocks NOT trap ***/
      const doubleEventBlockXReference = endStageFloorPosition + 1000;
      // for warp x position to line up with another event block's x position
      const eventBlockSurroundedByBlocksXPos
          = doubleEventBlockXReference + (2 * Constants.DEFAULT_EVENT_BLOCK_WIDTH);
      this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
          doubleEventBlockXReference,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          eventBlockSurroundedByBlocksXPos + (Constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT + Constants.SMALL_ENEMY_DIAMETER,
          true,
          true
      ));

      // invincible enemy at end of level
      const triggerEnemy: Enemy = new Enemy(
          platformer.getCurrentActiveLevelWidth() - (Constants.BIG_ENEMY_DIAMETER / 2),
          Constants.LEVEL_FLOOR_Y_POSITION - (Constants.BIG_ENEMY_DIAMETER / 2),
          Constants.BIG_ENEMY_DIAMETER,
          0,
          true,
          true,
          false
      );
      this.levelDrawableCollection.addDrawable(triggerEnemy);
      this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
          doubleEventBlockXReference + Math.floor((1.5 * Constants.DEFAULT_EVENT_BLOCK_WIDTH)),
          0,
          Constants.LEVEL_FLOOR_Y_POSITION,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          true,
          triggerEnemy
      ));
      // warp to event block with invincible enemy
      this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
          eventBlockSurroundedByBlocksXPos,
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_EVENT_BLOCK_WIDTH,
          Constants.DEFAULT_EVENT_BLOCK_HEIGHT,
          Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          eventBlockInvulnerableEnemyXReference + (Constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
          Constants.LEVEL_FLOOR_Y_POSITION - Constants.DEFAULT_EVENT_BLOCK_HEIGHT + Constants.SMALL_ENEMY_DIAMETER,
          true,
          true
      ));
      /*** END two event blocks NOT trap ***/
  }

}
