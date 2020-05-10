import { ALevel } from "./level.abstract";
import { constants } from "../../const/constants";
import { ResourceUtils } from "../../utils/resource-utils";
import { ESongType } from "../../enums/song-type.enum";
import { ViewBox } from "../viewbox/viewbox";
import { Player } from "../characters/player";
import { Checkpoint } from "../collectables/checkpoint";
import { VerticalBoundary } from "../boundaries/vertical-boundary";
import { platformer } from '../../platformer';
import { LevelGoal } from "../collectables/level-goal";
import { FlyingEnemy } from "../characters/flying-enemy";
import { HealthItem } from "../collectables/health-item";
import { ItemBlock } from "../blocks/item-block";
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { EnemyTriggerVerticalBoundary } from "../boundaries/enemy-trigger-vertical-boundary";
import { EventBlock } from "../blocks/event-block";
import { Enemy } from "../characters/enemy";
import { Block } from "../blocks/block";
import { ControllableEnemy } from "../characters/controllable-enemy";

/**
 * Level three
 */
export class LevelThree extends ALevel {

  /**
   * sets properties, boundaries, and characters of this
   */
  constructor(isActive: boolean, loadPlayerFromCheckPoint: boolean) {
    super(isActive, loadPlayerFromCheckPoint, 200);
  }

  setUpActivateLevel(): void {
    const playerStartXPos = constants.SCREEN_WIDTH / 6;
    const playerStartYPos = constants.SCREEN_HEIGHT / 4;
    this.checkpointXPos = 15 * playerStartXPos + 5 * constants.CHECKPOINT_WIDTH;

    this.makeActive();
    ResourceUtils.loopSong(ESongType.LEVEL);

    if (this.isLoadPlayerFromCheckPoint()) {
      this.viewBox = new ViewBox(
        this.checkpointXPos - 200,
        playerStartYPos,
        true);
      this.player = new Player(
        this.checkpointXPos,
        playerStartYPos,
        constants.PLAYER_DIAMETER,
        1,
        true);
    } else {
      this.viewBox = new ViewBox(
        0,
        playerStartYPos,
        true);
      this.player = new Player(
        playerStartXPos,
        playerStartYPos,
        constants.PLAYER_DIAMETER,
        1,
        true);

      this.levelDrawableCollection.addDrawable(new Checkpoint(
        this.checkpointXPos,
        constants.LEVEL_FLOOR_Y_POSITION - constants.CHECKPOINT_HEIGHT,
        constants.CHECKPOINT_WIDTH,
        constants.CHECKPOINT_HEIGHT,
        constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
        true));
    }

    let levelFloorXPosReference = this.setupActivateBeginningBeforeCheckpoint(playerStartXPos, playerStartYPos);
    levelFloorXPosReference = this.setupActivateEndBeforeCheckpoint(levelFloorXPosReference + 332);

    levelFloorXPosReference = this.setupActivateBeginningAfterCheckpoint(levelFloorXPosReference + 300);
    this.setupActivateEndAfterCheckpoint(levelFloorXPosReference);
  }

  /**
   * @return x-pos of left-most drawable in section
   */
  private setupActivateBeginningBeforeCheckpoint(beginningGoalXPos: number, beginningGoalYPos: number) {
    // extend left wall to bottom of level
    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      platformer.getCurrentActiveLevelHeight() - constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));


    this.levelDrawableCollection.addDrawable(new LevelGoal(
      beginningGoalXPos,
      beginningGoalYPos + 2 * constants.PLAYER_DIAMETER,
      constants.CHECKPOINT_WIDTH,
      constants.SCREEN_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true
    ));

    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      2 * beginningGoalXPos,
      beginningGoalYPos,
      platformer.getCurrentActiveLevelHeight() - (beginningGoalYPos / 2),
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));

    this.levelDrawableCollection.addDrawable(new FlyingEnemy(
      2 * beginningGoalXPos,
      constants.SMALL_ENEMY_DIAMETER,
      constants.SMALL_ENEMY_DIAMETER,
      0,
      constants.ENEMY_FAST_MOVEMENT_SPEED,
      null,
      null,
      false,
      false,
      true,
      true,
      true
    ));

    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      4 * beginningGoalXPos,
      platformer.getCurrentActiveLevelHeight() / 2,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));
    const healthItemForBlock = new HealthItem(
      1,
      0,
      0,
      constants.HEALTH_ITEM_SIZE,
      constants.HEALTH_ITEM_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      false
    );
    this.levelDrawableCollection.addDrawable((healthItemForBlock));
    this.levelDrawableCollection.addDrawable(new ItemBlock(
      4 * beginningGoalXPos + constants.PLAYER_DIAMETER,
      (platformer.getCurrentActiveLevelHeight() / 2) - (2 * constants.DEFAULT_BLOCK_SIZE),
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      healthItemForBlock,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      false,
      false,
      true
    ));

    // double flying enemy groups
    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      6 * beginningGoalXPos,
      beginningGoalYPos,
      platformer.getCurrentActiveLevelHeight() - (beginningGoalYPos / 2),
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      6 * beginningGoalXPos,
      platformer.getCurrentActiveLevelHeight() + 1,
      2 * beginningGoalXPos,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));
    for (let i = 0; i < 10; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy(
        7 * beginningGoalXPos,
        (constants.SMALL_ENEMY_DIAMETER / 2) + (constants.SMALL_ENEMY_DIAMETER * i),
        constants.SMALL_ENEMY_DIAMETER,
        0,
        constants.ENEMY_FAST_MOVEMENT_SPEED,
        null,
        null,
        false,
        false,
        true,
        true,
        true
      ));
    }
    for (let i = 0; i < 10; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy(
        7 * beginningGoalXPos,
        (platformer.getCurrentActiveLevelHeight() - (constants.SMALL_ENEMY_DIAMETER / 2)) - (constants.SMALL_ENEMY_DIAMETER * i),
        constants.SMALL_ENEMY_DIAMETER,
        0,
        -constants.ENEMY_FAST_MOVEMENT_SPEED,
        null,
        null,
        true,
        false,
        true,
        true,
        true
      ));
    }

    const leftMostDrawableXPos = 8 * beginningGoalXPos;
    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      leftMostDrawableXPos,
      beginningGoalYPos,
      platformer.getCurrentActiveLevelHeight() - (beginningGoalYPos / 2),
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));

    return leftMostDrawableXPos;

  }

  /**
   * @return x-pos of left-most drawable in section
   */
  private setupActivateEndBeforeCheckpoint(startXPos: number): number {
    // small middle gap with enemies
    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      startXPos,
      0,
      platformer.getCurrentActiveLevelHeight() / 2 - constants.PLAYER_DIAMETER,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));
    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      startXPos,
      platformer.getCurrentActiveLevelHeight() / 2 + constants.PLAYER_DIAMETER,
      platformer.getCurrentActiveLevelHeight() -
      (platformer.getCurrentActiveLevelHeight() / 2 + constants.PLAYER_DIAMETER),
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      startXPos,
      platformer.getCurrentActiveLevelHeight() / 3,
      5 * constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));
    for (let i = 0; i < 4; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy(
        startXPos + (3 * constants.SMALL_ENEMY_DIAMETER / 2),
        platformer.getCurrentActiveLevelHeight() / 2 + i * constants.PLAYER_DIAMETER,
        constants.SMALL_ENEMY_DIAMETER,
        0,
        0,
        null,
        null,
        false,
        false,
        true,
        true,
        true
      ));
    }

    const mediumEnemyWallXPos = (startXPos * 3) / 2;
    // medium enemy wall
    for (let i = 0; i < 3; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy(
        mediumEnemyWallXPos,
        constants.MEDIUM_ENEMY_DIAMETER / 2 + i * constants.MEDIUM_ENEMY_DIAMETER,
        constants.MEDIUM_ENEMY_DIAMETER,
        0,
        0,
        null,
        null,
        false,
        false,
        true,
        true,
        true
      ));
    }

    const sectionFloorXOffset = this.checkpointXPos - (mediumEnemyWallXPos);
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      mediumEnemyWallXPos,
      constants.LEVEL_FLOOR_Y_POSITION,
      sectionFloorXOffset,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      false,
      true,
      true
    ));

    return mediumEnemyWallXPos + sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateBeginningAfterCheckpoint(startXPos: number): number {
    const sectionFloorXOffset = 2000;
    // section floor
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

    // fast up flying enemy and trigger
    let enemyToAddForTrigger = new FlyingEnemy(
      startXPos - 150,
      constants.SCREEN_HEIGHT,
      constants.MEDIUM_ENEMY_DIAMETER,
      0,
      -constants.ENEMY_FAST_MOVEMENT_SPEED * 3,
      -constants.MEDIUM_ENEMY_DIAMETER,
      constants.SCREEN_HEIGHT,
      false,
      false,
      true,
      true,
      false
    );
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos - 250,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyToAddForTrigger
    ));

    this.levelDrawableCollection.addDrawable(new EventBlock( // launch event
      startXPos,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY / 2],
      true,
      true
    ));
    this.levelDrawableCollection.addDrawable(new EventBlock( // launch event
      startXPos + constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY],
      true,
      true
    ));

    // small flying enemy group with trigger
    let enemiesToAddForTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 5; i++) {
      enemyToAddForTrigger = new FlyingEnemy(
        startXPos + 8 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
        constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2) - (constants.SMALL_ENEMY_DIAMETER * i),
        constants.SMALL_ENEMY_DIAMETER,
        -constants.ENEMY_FAST_MOVEMENT_SPEED,
        0,
        null,
        null,
        false,
        true,
        false,
        true,
        false
      );
      enemiesToAddForTrigger.add(enemyToAddForTrigger);
      this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 4 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemiesToAddForTrigger
    ));

    // flying enemy wall that covers height of screen and trigger
    enemiesToAddForTrigger = new Set();
    let currFlyingEnemyYPos = constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2);
    while (currFlyingEnemyYPos > constants.SMALL_ENEMY_DIAMETER / 2) {
      enemyToAddForTrigger = new FlyingEnemy(
        startXPos + 11 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
        currFlyingEnemyYPos,
        constants.SMALL_ENEMY_DIAMETER,
        -constants.ENEMY_FAST_MOVEMENT_SPEED,
        0,
        null,
        null,
        false,
        true,
        false,
        true,
        false
      );
      enemiesToAddForTrigger.add(enemyToAddForTrigger);
      this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
      currFlyingEnemyYPos = currFlyingEnemyYPos - constants.SMALL_ENEMY_DIAMETER;
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 6 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemiesToAddForTrigger
    ));

    return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndAfterCheckpoint(startXPos: number): void {
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      startXPos,
      constants.LEVEL_FLOOR_Y_POSITION,
      3500,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));

    // big falling enemy with trigger; and block
    let enemyToAddForTrigger = new Enemy(
      startXPos + 250,
      -constants.BIG_ENEMY_DIAMETER / 2 + 1,
      constants.BIG_ENEMY_DIAMETER,
      0,
      true,
      true,
      false
    );
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 250,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyToAddForTrigger
    ));
    this.levelDrawableCollection.addDrawable(new Block(
      startXPos + 250,
      constants.SCREEN_HEIGHT / 2,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      false,
      false,
      true
    ));

    this.levelDrawableCollection.addDrawable(new HealthItem(
      1,
      startXPos + 1000,
      constants.LEVEL_FLOOR_Y_POSITION - constants.HEALTH_ITEM_SIZE,
      constants.HEALTH_ITEM_SIZE,
      constants.HEALTH_ITEM_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true
    ));

    // zig-zag enemies and trigger
    const enemiesToAddForTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 8; i++) {
      enemyToAddForTrigger = new FlyingEnemy(
        startXPos + 1500 + (250 * i),
        constants.LEVEL_FLOOR_Y_POSITION - (2 * constants.SMALL_ENEMY_DIAMETER),
        constants.SMALL_ENEMY_DIAMETER,
        -constants.ENEMY_FAST_MOVEMENT_SPEED,
        constants.ENEMY_FAST_MOVEMENT_SPEED,
        constants.LEVEL_FLOOR_Y_POSITION - (4 * constants.SMALL_ENEMY_DIAMETER),
        constants.LEVEL_FLOOR_Y_POSITION,
        false,
        true,
        false,
        true,
        false
      );
      enemiesToAddForTrigger.add(enemyToAddForTrigger);
      this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 1000,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemiesToAddForTrigger
    ));

    // invincible enemy near end
    this.levelDrawableCollection.addDrawable(new Enemy(
      startXPos + 2000,
      constants.LEVEL_FLOOR_Y_POSITION - constants.BIG_ENEMY_DIAMETER,
      constants.BIG_ENEMY_DIAMETER,
      0,
      true,
      true,
      true
    ));

    // controllable enemy at end
    enemyToAddForTrigger = new ControllableEnemy(
      platformer.getCurrentActiveLevelWidth() - constants.SMALL_ENEMY_DIAMETER,
      constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
      constants.SMALL_ENEMY_DIAMETER,
      true,
      true,
      constants.PLAYER_MOVEMENT_SPEED,
      false,
      true,
      false
    );
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 1500,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyToAddForTrigger
    ));
  }

}