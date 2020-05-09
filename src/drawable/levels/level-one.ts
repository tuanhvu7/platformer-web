import { ALevel } from "./level.abstract";
import { constants } from "../../const/constants";
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
    super(isActive, loadPlayerFromCheckPoint, constants.BIG_ENEMY_DIAMETER + 200);
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
      this.player = new Player(this.checkpointXPos, 0, constants.PLAYER_DIAMETER, 1, true);
    } else {
      this.viewBox = new ViewBox(0, 0, true);
      this.player = new Player(200, 0, constants.PLAYER_DIAMETER, 1, true);

      this.levelDrawableCollection.addDrawable(new Checkpoint(
        this.checkpointXPos,
        constants.LEVEL_FLOOR_Y_POSITION - constants.CHECKPOINT_HEIGHT,
        constants.CHECKPOINT_WIDTH,
        constants.CHECKPOINT_HEIGHT,
        constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
        true));
    }

    let levelFloorXPosReference: number = this.setupActivateBeforeCheckpoint();
    levelFloorXPosReference = this.setupActivateMiddleSectionAfterCheckpoint(levelFloorXPosReference + 500);
    this.setupActivateEndSection(levelFloorXPosReference);

    this.bigEnemyTriggerCharacterListSizeCondition = this.levelDrawableCollection.getCharactersList().size - 2;
  }

  /**
   * handle conditional enemy triggers in this;
   * to override in extended classes
   */
  public handleConditionalEnemyTriggers(): void {
    if (!this.bigEnemyTriggerActivated &&
      this.levelDrawableCollection.getCharactersList().size <= 12) {  // TODO: avoid hardcoding 12

      const triggerEnemy: Enemy = new Enemy(
        3000,
        0,
        constants.BIG_ENEMY_DIAMETER,
        -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
        false,
        true,
        false
      );
      this.levelDrawableCollection.addDrawable(triggerEnemy);

      this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
        2900,
        0,
        constants.LEVEL_FLOOR_Y_POSITION,
        constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
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
      constants.LEVEL_FLOOR_Y_POSITION,
      sectionFloorXOffset,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));

    this.levelDrawableCollection.addDrawable(new Enemy(
      500,
      0,
      constants.BIG_ENEMY_DIAMETER,
      -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      false,
      true,
      true));

    this.levelDrawableCollection.addDrawable(new Block(
      750,
      mainSketch.height - 300 - constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true
    ));

    // TODO: loop
    this.levelDrawableCollection.addDrawable(new Enemy(
      1750,
      0,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      false,
      true,
      true));
    this.levelDrawableCollection.addDrawable(new Enemy(
      1750 + constants.SMALL_ENEMY_DIAMETER,
      0,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      false,
      true,
      true));
    this.levelDrawableCollection.addDrawable(new Enemy(
      1750 + 2 * constants.SMALL_ENEMY_DIAMETER,
      0,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      false,
      true,
      true));
    this.levelDrawableCollection.addDrawable(new Enemy(
      1750 + 3 * constants.SMALL_ENEMY_DIAMETER,
      0,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      false,
      true,
      true));
    this.levelDrawableCollection.addDrawable(new Enemy(
      1750 + 4 * constants.SMALL_ENEMY_DIAMETER,
      0,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      false,
      true,
      true));
    this.levelDrawableCollection.addDrawable(new Enemy(
      1750 + 5 * constants.SMALL_ENEMY_DIAMETER,
      0,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      false,
      true,
      true));
    this.levelDrawableCollection.addDrawable(new Enemy(
      1750 + 6 * constants.SMALL_ENEMY_DIAMETER,
      0,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_SLOW_MOVEMENT_SPEED,
      false,
      true,
      true));

    this.levelDrawableCollection.addDrawable(new EventBlock( // launch event
      2000,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY],
      true,
      true
    ));

    const playerWarpEndXPos = 2800;
    this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
      2000 + constants.DEFAULT_EVENT_BLOCK_WIDTH + constants.PLAYER_DIAMETER + 100,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [
        playerWarpEndXPos,
        750
      ],
      true,
      true
    ));

    this.levelDrawableCollection.addDrawable(new Block(
      2550,
      constants.LEVEL_FLOOR_Y_POSITION - 300 - constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
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
      constants.LEVEL_FLOOR_Y_POSITION,
      sectionFloorXOffset,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));

    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      startXPos + 250,
      constants.LEVEL_FLOOR_Y_POSITION - 4 * constants.PLAYER_DIAMETER,
      4 * constants.PLAYER_DIAMETER,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));

    // controllable enemy
    let enemyToAdd: Enemy = new ControllableEnemy(
      startXPos + 1000 + 4 * constants.PLAYER_DIAMETER,
      constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER - 10,
      constants.SMALL_ENEMY_DIAMETER,
      true,
      false,
      -constants.ENEMY_FAST_MOVEMENT_SPEED,
      false,
      true,
      false
    );
    this.levelDrawableCollection.addDrawable(enemyToAdd);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 500 + 4 * constants.PLAYER_DIAMETER,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyToAdd
    ));

    // flying enemies
    const triggerEnemySet: Set < Enemy > = new Set();
    for (let i = 1; i <= 2; i++) {
      enemyToAdd = new FlyingEnemy(
        startXPos + 1600 + (4 * i) * constants.PLAYER_DIAMETER,
        constants.LEVEL_FLOOR_Y_POSITION - (2 + 2 * i) * constants.PLAYER_DIAMETER,
        constants.SMALL_ENEMY_DIAMETER,
        -constants.ENEMY_FAST_MOVEMENT_SPEED,
        0,
        null,
        null,
        false,
        false,
        false,
        true,
        false);
      triggerEnemySet.add(enemyToAdd);
      this.levelDrawableCollection.addDrawable(enemyToAdd);
    }

    enemyToAdd = new FlyingEnemy(
      startXPos + 1600 + 14 * constants.PLAYER_DIAMETER,
      constants.LEVEL_FLOOR_Y_POSITION - 5 * constants.PLAYER_DIAMETER,
      constants.BIG_ENEMY_DIAMETER,
      -constants.ENEMY_FAST_MOVEMENT_SPEED,
      0,
      null,
      null,
      false,
      false,
      false,
      true,
      false);
    triggerEnemySet.add(enemyToAdd);
    this.levelDrawableCollection.addDrawable(enemyToAdd);

    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 1100 + 4 * constants.PLAYER_DIAMETER,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
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
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      false,
      true,
      true
    ));
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      startXPos + 250,
      constants.LEVEL_FLOOR_Y_POSITION,
      250,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
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
      constants.LEVEL_FLOOR_Y_POSITION,
      platformer.getCurrentActiveLevelWidth() - startXPos,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));

    // event block with invincible enemy
    const eventBlockInvulnerableEnemyXReference = endStageFloorPosition + 300;
    this.levelDrawableCollection.addDrawable(new EventBlock( // launch event
      eventBlockInvulnerableEnemyXReference,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY],
      true,
      true
    ));
    this.levelDrawableCollection.addDrawable(new Enemy(
      eventBlockInvulnerableEnemyXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - constants.SMALL_ENEMY_DIAMETER,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
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
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [
        eventBlockTrapXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      ],
      true,
      true
    ));

    this.levelDrawableCollection.addDrawable(new Block( // block left of event block trap
      eventBlockTrapXReference - constants.DEFAULT_BLOCK_SIZE,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * constants.PLAYER_DIAMETER),
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT + (4 * constants.PLAYER_DIAMETER),
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      false,
      true
    ));
    this.levelDrawableCollection.addDrawable(new Block( // block above event block trap
      eventBlockTrapXReference,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * constants.PLAYER_DIAMETER),
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      false,
      true
    ));
    this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
      eventBlockTrapXReference,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [
        eventBlockInvulnerableEnemyXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      ],
      true,
      true
    ));
    this.levelDrawableCollection.addDrawable(new Block( // block right of event block trap
      eventBlockTrapXReference + constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - (4 * constants.PLAYER_DIAMETER),
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT + (4 * constants.PLAYER_DIAMETER),
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      false,
      true
    ));
    /*** END two event blocks trap ***/


    /*** START two event blocks NOT trap ***/
    const doubleEventBlockXReference = endStageFloorPosition + 1000;
    // for warp x position to line up with another event block's x position
    const eventBlockSurroundedByBlocksXPos = doubleEventBlockXReference + (2 * constants.DEFAULT_EVENT_BLOCK_WIDTH);
    this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
      doubleEventBlockXReference,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [
        eventBlockSurroundedByBlocksXPos + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      ],
      true,
      true
    ));

    // invincible enemy at end of level
    const triggerEnemy: Enemy = new Enemy(
      platformer.getCurrentActiveLevelWidth() - (constants.BIG_ENEMY_DIAMETER / 2),
      constants.LEVEL_FLOOR_Y_POSITION - (constants.BIG_ENEMY_DIAMETER / 2),
      constants.BIG_ENEMY_DIAMETER,
      0,
      true,
      true,
      false
    );
    this.levelDrawableCollection.addDrawable(triggerEnemy);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      doubleEventBlockXReference + Math.floor((1.5 * constants.DEFAULT_EVENT_BLOCK_WIDTH)),
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      triggerEnemy
    ));
    // warp to event block with invincible enemy
    this.levelDrawableCollection.addDrawable(new EventBlock( // warp event
      eventBlockSurroundedByBlocksXPos,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [
        eventBlockInvulnerableEnemyXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
        constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT + constants.SMALL_ENEMY_DIAMETER
      ],
      true,
      true
    ));
    /*** END two event blocks NOT trap ***/
  }

}