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
  constructor(initAsActive: boolean, loadPlayerFromCheckPoint: boolean) {
    super(initAsActive, loadPlayerFromCheckPoint, 200);
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
      this.player = new Player({
        x: this.checkpointXPos,
        y: playerStartYPos,
        diameter: constants.PLAYER_DIAMETER,
        health: 1
      });
    } else {
      this.viewBox = new ViewBox(
        0,
        playerStartYPos,
        true);
      this.player = new Player({
        x: playerStartXPos,
        y: playerStartYPos,
        diameter: constants.PLAYER_DIAMETER,
        health: 1,
      });

      this.levelDrawableCollection.addDrawable(new Checkpoint({
        leftX: this.checkpointXPos,
        topY: constants.LEVEL_FLOOR_Y_POSITION - constants.CHECKPOINT_HEIGHT,
        width: constants.CHECKPOINT_WIDTH,
        height: constants.CHECKPOINT_HEIGHT
      }));
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
    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: 0,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      y2Offset: platformer.getCurrentActiveLevelHeight() - constants.LEVEL_FLOOR_Y_POSITION
    }));


    this.levelDrawableCollection.addDrawable(new LevelGoal({
      leftX: beginningGoalXPos,
      topY: beginningGoalYPos + 2 * constants.PLAYER_DIAMETER,
      width: constants.CHECKPOINT_WIDTH,
      height: constants.SCREEN_HEIGHT
    }));

    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: 2 * beginningGoalXPos,
      startYPoint: beginningGoalYPos,
      y2Offset: platformer.getCurrentActiveLevelHeight() - (beginningGoalYPos / 2)
    }));

    this.levelDrawableCollection.addDrawable(new FlyingEnemy({
      x: 2 * beginningGoalXPos,
      y: constants.SMALL_ENEMY_DIAMETER,
      diameter: constants.SMALL_ENEMY_DIAMETER,
      horizontalVel: 0,
      verticalVel: constants.ENEMY_FAST_MOVEMENT_SPEED,
      isAffectedByHorizontalBoundaries: false,
      isAffectedByVerticalBoundaries: false,
      isInvulnerable: true
    }));

    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: 4 * beginningGoalXPos,
      startYPoint: platformer.getCurrentActiveLevelHeight() / 2,
      y2Offset: constants.DEFAULT_BLOCK_SIZE
    }));
    const healthItemForBlock = new HealthItem({
      healthChangeAmount: 1,
      leftX: 0,
      topY: 0,
      width: constants.HEALTH_ITEM_SIZE,
      height: constants.HEALTH_ITEM_SIZE,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable((healthItemForBlock));
    this.levelDrawableCollection.addDrawable(new ItemBlock({
      leftX: 4 * beginningGoalXPos + constants.PLAYER_DIAMETER,
      topY: (platformer.getCurrentActiveLevelHeight() / 2) - (2 * constants.DEFAULT_BLOCK_SIZE),
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_BLOCK_SIZE,
      item: healthItemForBlock,
      isVisible: false
    }));

    // double flying enemy groups
    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: 6 * beginningGoalXPos,
      startYPoint: beginningGoalYPos,
      y2Offset: platformer.getCurrentActiveLevelHeight() - (beginningGoalYPos / 2)
    }));
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: 6 * beginningGoalXPos,
      startYPoint: platformer.getCurrentActiveLevelHeight() + 1,  // +1 so not visible on screen
      x2Offset: 2 * beginningGoalXPos,
      isFloorBoundary: true
    }));
    for (let i = 0; i < 10; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy({
        x: 7 * beginningGoalXPos,
        y: (constants.SMALL_ENEMY_DIAMETER / 2) + (constants.SMALL_ENEMY_DIAMETER * i),
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: 0,
        verticalVel: constants.ENEMY_FAST_MOVEMENT_SPEED,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false,
        isInvulnerable: true
      }));
    }
    for (let i = 0; i < 10; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy({
        x: 7 * beginningGoalXPos,
        y: (platformer.getCurrentActiveLevelHeight()
          - (constants.SMALL_ENEMY_DIAMETER / 2)) - (constants.SMALL_ENEMY_DIAMETER * i),
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: 0,
        verticalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false,
        isInvulnerable: true
      }));
    }

    const leftMostDrawableXPos = 8 * beginningGoalXPos;
    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: leftMostDrawableXPos,
      startYPoint: beginningGoalYPos,
      y2Offset: platformer.getCurrentActiveLevelHeight() - (beginningGoalYPos / 2)
    }));

    return leftMostDrawableXPos;

  }

  /**
   * @return x-pos of left-most drawable in section
   */
  private setupActivateEndBeforeCheckpoint(startXPos: number): number {
    // small middle gap with enemies
    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: startXPos,
      startYPoint: 0,
      y2Offset: platformer.getCurrentActiveLevelHeight() / 2 - constants.PLAYER_DIAMETER
    }));
    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: startXPos,
      startYPoint: platformer.getCurrentActiveLevelHeight() / 2 + constants.PLAYER_DIAMETER,
      y2Offset: platformer.getCurrentActiveLevelHeight()
        - (platformer.getCurrentActiveLevelHeight() / 2 + constants.PLAYER_DIAMETER)
    }));
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: platformer.getCurrentActiveLevelHeight() / 3,
      x2Offset: 5 * constants.DEFAULT_BLOCK_SIZE,
      isFloorBoundary: true
    }));
    for (let i = 0; i < 4; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy({
        x: startXPos + (3 * constants.SMALL_ENEMY_DIAMETER / 2),
        y: platformer.getCurrentActiveLevelHeight() / 2 + i * constants.PLAYER_DIAMETER,
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: 0,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false,
        isInvulnerable: true
      }));
    }

    const mediumEnemyWallXPos = (startXPos * 3) / 2;
    // medium enemy wall
    for (let i = 0; i < 3; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy({
        x: mediumEnemyWallXPos,
        y: constants.MEDIUM_ENEMY_DIAMETER / 2 + i * constants.MEDIUM_ENEMY_DIAMETER,
        diameter: constants.MEDIUM_ENEMY_DIAMETER,
        horizontalVel: 0,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false,
        isInvulnerable: true
      }));
    }

    const sectionFloorXOffset = this.checkpointXPos - (mediumEnemyWallXPos);
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: mediumEnemyWallXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      doesAffectNonPlayers: false,
      isFloorBoundary: true
    }));

    return mediumEnemyWallXPos + sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateBeginningAfterCheckpoint(startXPos: number): number {
    const sectionFloorXOffset = 2000;
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      isFloorBoundary: true
    }));

    // fast up flying enemy and trigger
    let enemyToAddForTrigger = new FlyingEnemy({
      x: startXPos - 150,
      y: constants.SCREEN_HEIGHT,
      diameter: constants.MEDIUM_ENEMY_DIAMETER,
      horizontalVel: 0,
      verticalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED * 3,
      topYLimit: -constants.MEDIUM_ENEMY_DIAMETER,
      bottomYLimit: constants.SCREEN_HEIGHT,
      isAffectedByHorizontalBoundaries: false,
      isAffectedByVerticalBoundaries: false,
      isInvulnerable: true,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos - 250,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyToAddForTrigger
    }));

    this.levelDrawableCollection.addDrawable(new EventBlock({ // launch event
      leftX: startXPos,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      launchEventVerticalVelocity: constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY / 2,
      isEventTriggerFloorBoundary: true
    }));
    this.levelDrawableCollection.addDrawable(new EventBlock({ // launch event
      leftX: startXPos + constants.DEFAULT_EVENT_BLOCK_WIDTH,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      launchEventVerticalVelocity: constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY,
      isEventTriggerFloorBoundary: true
    }));

    // small flying enemy group with trigger
    let enemiesToAddForTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 5; i++) {
      enemyToAddForTrigger = new FlyingEnemy({
        x: startXPos + 8 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
        y: constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2) - (constants.SMALL_ENEMY_DIAMETER * i),
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: true,
        initAsActive: false
      });
      enemiesToAddForTrigger.add(enemyToAddForTrigger);
      this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 4 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemiesToAddForTrigger
    }));

    // flying enemy wall that covers height of screen and trigger
    enemiesToAddForTrigger = new Set();
    let currFlyingEnemyYPos = constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2);
    while (currFlyingEnemyYPos > constants.SMALL_ENEMY_DIAMETER / 2) {
      enemyToAddForTrigger = new FlyingEnemy({
        x: startXPos + 11 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
        y: currFlyingEnemyYPos,
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: true,
        initAsActive: false
      });
      enemiesToAddForTrigger.add(enemyToAddForTrigger);
      this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
      currFlyingEnemyYPos = currFlyingEnemyYPos - constants.SMALL_ENEMY_DIAMETER;
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 6 * constants.DEFAULT_EVENT_BLOCK_WIDTH,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemiesToAddForTrigger
    }));

    return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndAfterCheckpoint(startXPos: number): void {
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: 3500,
      isFloorBoundary: true
    }));

    // big falling enemy with trigger; and block
    let enemyToAddForTrigger = new Enemy({
      x: startXPos + 250,
      y: -constants.BIG_ENEMY_DIAMETER / 2 + 1,
      diameter: constants.BIG_ENEMY_DIAMETER,
      horizontalVel: 0,
      isInvulnerable: true,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 250,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyToAddForTrigger
    }));
    this.levelDrawableCollection.addDrawable(new Block({
      leftX: startXPos + 250,
      topY: constants.SCREEN_HEIGHT / 2,
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_BLOCK_SIZE,
      isVisible: false
    }));

    this.levelDrawableCollection.addDrawable(new HealthItem({
      healthChangeAmount: 1,
      leftX: startXPos + 1000,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.HEALTH_ITEM_SIZE,
      width: constants.HEALTH_ITEM_SIZE,
      height: constants.HEALTH_ITEM_SIZE
    }));

    // zig-zag enemies and trigger
    const enemiesToAddForTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 8; i++) {
      enemyToAddForTrigger = new FlyingEnemy({
        x: startXPos + 1500 + (250 * i),
        y: constants.LEVEL_FLOOR_Y_POSITION - (2 * constants.SMALL_ENEMY_DIAMETER),
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: -constants.ENEMY_FAST_MOVEMENT_SPEED,
        verticalVel: constants.ENEMY_FAST_MOVEMENT_SPEED,
        topYLimit: constants.LEVEL_FLOOR_Y_POSITION - (4 * constants.SMALL_ENEMY_DIAMETER),
        bottomYLimit: constants.LEVEL_FLOOR_Y_POSITION,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: true,
        initAsActive: false
      });
      enemiesToAddForTrigger.add(enemyToAddForTrigger);
      this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 1000,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemiesToAddForTrigger
    }));

    // invincible enemy near end
    this.levelDrawableCollection.addDrawable(new Enemy({
      x: startXPos + 2000,
      y: constants.LEVEL_FLOOR_Y_POSITION - constants.BIG_ENEMY_DIAMETER,
      diameter: constants.BIG_ENEMY_DIAMETER,
      horizontalVel: 0,
      isInvulnerable: true
    }));

    // controllable enemy at end
    enemyToAddForTrigger = new ControllableEnemy({
      x: platformer.getCurrentActiveLevelWidth() - constants.SMALL_ENEMY_DIAMETER,
      y: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
      diameter: constants.SMALL_ENEMY_DIAMETER,
      isJumpControllable: true,
      isHorizontalControllable: true,
      horizontalVel: constants.PLAYER_MOVEMENT_SPEED,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 1500,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyToAddForTrigger
    }));
  }

}