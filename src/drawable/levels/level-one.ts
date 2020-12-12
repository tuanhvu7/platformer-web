import { ALevel } from "./level.abstract";
import { constants } from '../../const/constants';
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

  /**
   * Custom properties for subClassCustomProperties are:
   * - bigEnemyTriggerActivated: boolean
   *    true means big enemy trigger boundary has been activated
   * - bigEnemyTriggerCharacterListSizeCondition: number
   *    size of this characters list to make big enemy trigger boundary active
   */

  /**
   * sets properties, boundaries, and characters of this
   */
  constructor(initAsActive: boolean, loadPlayerFromCheckPoint: boolean) {
    super(initAsActive, loadPlayerFromCheckPoint, constants.BIG_ENEMY_DIAMETER + 200);
  }

  public draw(): void {
    this.drawBackground();
    this.handleConditionalEnemyTriggers();
  }

  /**
   * setup and activate this
   */
  public setUpActivateLevel(): void {
    this.subClassCustomProperties.bigEnemyTriggerActivated = false;
    this.checkpointXPos = 3100;

    this.makeActive();
    ResourceUtils.loopSong(ESongType.LEVEL);

    if (this.loadPlayerFromCheckPoint) {
      this.viewBox = new ViewBox(this.checkpointXPos - 200, 0, true);
      this.player = new Player({
        x: this.checkpointXPos,
        y: 0,
        diameter: constants.PLAYER_DIAMETER,
        health: 1
      });
    } else {
      this.viewBox = new ViewBox(0, 0, true);
      this.player = new Player({
        x: 200,
        y: 0,
        diameter: constants.PLAYER_DIAMETER,
        health: 1
      });

      this.levelDrawableCollection.addDrawable(new Checkpoint({
        leftX: this.checkpointXPos,
        topY: constants.LEVEL_FLOOR_Y_POSITION - constants.CHECKPOINT_HEIGHT,
        width: constants.CHECKPOINT_WIDTH,
        height: constants.CHECKPOINT_HEIGHT
      }));
    }

    let levelFloorXPosReference: number = this.setupActivateBeforeCheckpoint();
    levelFloorXPosReference = this.setupActivateMiddleSectionAfterCheckpoint(levelFloorXPosReference + 500);
    this.setupActivateEndSection(levelFloorXPosReference);

    this.subClassCustomProperties.bigEnemyTriggerCharacterListSizeCondition
      = this.levelDrawableCollection.getCharactersList().size - 2;
  }

  /**
   * handle conditional enemy triggers in this;
   */
  private handleConditionalEnemyTriggers(): void {
    if (!this.subClassCustomProperties.bigEnemyTriggerActivated &&
        this.levelDrawableCollection.getCharactersList().size <= 
        this.subClassCustomProperties.bigEnemyTriggerCharacterListSizeCondition) {

      const triggerEnemy: Enemy = new Enemy({
        x: 3000,
        y: 0,
        diameter: constants.BIG_ENEMY_DIAMETER,
        horizontalVel: -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
        initAsActive: false
      });

      this.levelDrawableCollection.addDrawable(triggerEnemy);

      this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
        startXPoint: 2900,
        startYPoint: 0,
        y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
        enemy: triggerEnemy
      }));

      this.subClassCustomProperties.bigEnemyTriggerActivated = true;
    }
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateBeforeCheckpoint(): number {
    const sectionFloorXOffset = 2500;
    // stage floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: 0,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      isFloorBoundary: true
    }));

    this.levelDrawableCollection.addDrawable(new Enemy({
      x: 500,
      y: 0,
      diameter: constants.BIG_ENEMY_DIAMETER,
      horizontalVel: -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
    }));

    this.levelDrawableCollection.addDrawable(new Block({
      leftX: 750,
      topY: mainSketch.height - 300 - constants.DEFAULT_BLOCK_SIZE,
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_BLOCK_SIZE,
      isBreakableFromBottom: true
    }));

    for (let i = 0; i < 7; i++) {
      this.levelDrawableCollection.addDrawable(new Enemy({
        x: 1750 + i * constants.SMALL_ENEMY_DIAMETER,
        y: 0,
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      }));
    }

    this.levelDrawableCollection.addDrawable(new EventBlock({ // launch event
      leftX: 2000,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      isEventTriggerFloorBoundary: true,
      launchEventVerticalVelocity: constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY
    }));

    const playerWarpEndXPos = 2800;
    this.levelDrawableCollection.addDrawable(new EventBlock({ // warp event
      leftX: 2000 + constants.DEFAULT_EVENT_BLOCK_WIDTH + constants.PLAYER_DIAMETER + 100,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      warpDestination: {
        x: playerWarpEndXPos,
        y: 750
      },
      isEventTriggerFloorBoundary: true
    }));

    this.levelDrawableCollection.addDrawable(new Block({
      leftX: 2550,
      topY: constants.LEVEL_FLOOR_Y_POSITION - 300 - constants.DEFAULT_BLOCK_SIZE,
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_BLOCK_SIZE,
      isVisible: false
    }));

    return sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateMiddleSectionAfterCheckpoint(startXPos: number): number {
    const sectionFloorXOffset = 2000;
    // stage floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      isFloorBoundary: true
    }));

    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos + 250,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION - 4 * constants.PLAYER_DIAMETER,
      x2Offset: 4 * constants.PLAYER_DIAMETER,
      isFloorBoundary: true
    }));

    // controllable enemy
    let enemyToAdd: Enemy = new ControllableEnemy({
      x: startXPos + 1000 + 4 * constants.PLAYER_DIAMETER,
      y: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER - 10,
      diameter: constants.SMALL_ENEMY_DIAMETER,
      isJumpControllable: true,
      isHorizontalControllable: false,
      horizontalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable(enemyToAdd);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 500 + 4 * constants.PLAYER_DIAMETER,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyToAdd
    }));

    // flying enemies
    const triggerEnemySet: Set < Enemy > = new Set();
    for (let i = 1; i <= 2; i++) {
      enemyToAdd = new FlyingEnemy({
        x: startXPos + 1600 + (4 * i) * constants.PLAYER_DIAMETER,
        y: constants.LEVEL_FLOOR_Y_POSITION - (2 + 2 * i) * constants.PLAYER_DIAMETER,
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false,
        initAsActive: false
      });
      triggerEnemySet.add(enemyToAdd);
      this.levelDrawableCollection.addDrawable(enemyToAdd);
    }

    enemyToAdd = new FlyingEnemy({
      x: startXPos + 1600 + 14 * constants.PLAYER_DIAMETER,
      y: constants.LEVEL_FLOOR_Y_POSITION - 5 * constants.PLAYER_DIAMETER,
      diameter: constants.BIG_ENEMY_DIAMETER,
      horizontalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED,
      verticalVel: 0,
      isAffectedByHorizontalBoundaries: false,
      isAffectedByVerticalBoundaries: false,
      initAsActive: false
    });
    triggerEnemySet.add(enemyToAdd);
    this.levelDrawableCollection.addDrawable(enemyToAdd);

    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 1100 + 4 * constants.PLAYER_DIAMETER,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: triggerEnemySet
    }));

    return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndSection(startXPos: number): void {
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: platformer.getCurrentActiveLevelHeight() + 1, // +1 to make floor not visible on screen
      x2Offset: 250,
      doesAffectNonPlayers: false,
      isFloorBoundary: true
    }));

    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos + 250,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: 250,
      doesAffectPlayer: false,
      doesAffectNonPlayers: false,
      isFloorBoundary: true
    }));

    const endStageFloorPosition = startXPos + 500;
    // stage floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: endStageFloorPosition,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: platformer.getCurrentActiveLevelWidth() - startXPos,
      isFloorBoundary: true
    }));

    // event block with invincible enemy
    const eventBlockInvulnerableEnemyXReference = endStageFloorPosition + 300;
    this.levelDrawableCollection.addDrawable(new EventBlock({ // launch event
      leftX: eventBlockInvulnerableEnemyXReference,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      isEventTriggerFloorBoundary: true,
      launchEventVerticalVelocity: constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY
    }));

    this.levelDrawableCollection.addDrawable(new Enemy({
      x: eventBlockInvulnerableEnemyXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
      y: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - constants.SMALL_ENEMY_DIAMETER,
      diameter: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      horizontalVel: 0,
      isInvulnerable: true,
      isVisible: false
    }));

    /*** START two event blocks trap ***/
    const eventBlockGoingToTrapXReference = endStageFloorPosition + 750;
    const eventBlockTrapXReference = endStageFloorPosition + 2000;
    this.levelDrawableCollection.addDrawable(new EventBlock({ // warp event
      leftX: eventBlockGoingToTrapXReference,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      isEventTriggerFloorBoundary: true,
      warpDestination: {
        x: eventBlockTrapXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        y: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      }
    }));

    this.levelDrawableCollection.addDrawable(new Block({ // block left of event block trap
      leftX: eventBlockTrapXReference - constants.DEFAULT_BLOCK_SIZE,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * constants.PLAYER_DIAMETER),
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT + (4 * constants.PLAYER_DIAMETER)
    }));

    this.levelDrawableCollection.addDrawable(new Block({ // block above event block trap
      leftX: eventBlockTrapXReference,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * constants.PLAYER_DIAMETER),
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_BLOCK_SIZE,
    }));

    this.levelDrawableCollection.addDrawable(new EventBlock({ // warp event
      leftX: eventBlockTrapXReference,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      warpDestination: {
        x: eventBlockInvulnerableEnemyXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        y: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      },
      isEventTriggerFloorBoundary: true
    }));

    this.levelDrawableCollection.addDrawable(new Block({ // block right of event block trap
      leftX: eventBlockTrapXReference + constants.DEFAULT_EVENT_BLOCK_WIDTH,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * constants.PLAYER_DIAMETER),
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT + (4 * constants.PLAYER_DIAMETER),

    }));

    /*** END two event blocks trap ***/


    /*** START two event blocks NOT trap ***/
    const doubleEventBlockXReference = endStageFloorPosition + 1000;
    // for warp x position to line up with another event block's x position
    const eventBlockSurroundedByBlocksXPos = doubleEventBlockXReference + (2 * constants.DEFAULT_EVENT_BLOCK_WIDTH);
    this.levelDrawableCollection.addDrawable(new EventBlock({ // warp event
      leftX: doubleEventBlockXReference,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      warpDestination: {
        x: eventBlockSurroundedByBlocksXPos + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        y: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      },
      isEventTriggerFloorBoundary: true
    }));


    // invincible enemy at end of level
    const triggerEnemy: Enemy = new Enemy({
      x: platformer.getCurrentActiveLevelWidth() - (constants.BIG_ENEMY_DIAMETER / 2),
      y: constants.LEVEL_FLOOR_Y_POSITION - (constants.BIG_ENEMY_DIAMETER / 2),
      diameter: constants.BIG_ENEMY_DIAMETER,
      horizontalVel: 0,
      isInvulnerable: true,
      initAsActive: false
    });

    this.levelDrawableCollection.addDrawable(triggerEnemy);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: doubleEventBlockXReference + Math.floor((1.5 * constants.DEFAULT_EVENT_BLOCK_WIDTH)),
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: triggerEnemy
    }));

    // warp to event block with invincible enemy
    this.levelDrawableCollection.addDrawable(new EventBlock({ // warp event
      leftX: eventBlockSurroundedByBlocksXPos,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      warpDestination: {
        x: eventBlockInvulnerableEnemyXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        y: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      },
      isEventTriggerFloorBoundary: true
    }));
    /*** END two event blocks NOT trap ***/
  }

}