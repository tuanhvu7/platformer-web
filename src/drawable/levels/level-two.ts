import { constants } from "../../const/constants";
import { ALevel } from "./level.abstract";
import { ResourceUtils } from "../../utils/resource-utils";
import { ESongType } from "../../enums/song-type.enum";
import { platformer } from '../../platformer';
import { ViewBox } from "../viewbox/viewbox";
import { Player } from "../characters/player";
import { Checkpoint } from "../collectables/checkpoint";
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { VerticalBoundary } from "../boundaries/vertical-boundary";
import { FlyingEnemy } from "../characters/flying-enemy";
import { Enemy } from "../characters/enemy";
import { HealthItem } from "../collectables/health-item";
import { ItemBlock } from "../blocks/item-block";
import { Block } from "../blocks/block";
import { mainSketch } from '../../main';
import { EnemyTriggerVerticalBoundary } from "../boundaries/enemy-trigger-vertical-boundary";
import { EventBlock } from "../blocks/event-block";
import { LevelGoal } from "../collectables/level-goal";

/**
 * Level two
 */
export class LevelTwo extends ALevel {

  /**
   * sets properties, boundaries, and characters of this
   */
  constructor(initAsActive: boolean, loadPlayerFromCheckPoint: boolean) {
    super(initAsActive, loadPlayerFromCheckPoint, 4 * constants.PLAYER_DIAMETER);
  }

  /**
   * setup and activate this
   */
  public setUpActivateLevel(): void {
    this.makeActive();

    ResourceUtils.loopSong(ESongType.LEVEL);

    const levelMiddleXPos = platformer.getCurrentActiveLevelWidth() / 2;
    this.checkpointXPos = levelMiddleXPos - 1750 - 50;
    if (this.loadPlayerFromCheckPoint) {
      this.viewBox = new ViewBox(
        this.checkpointXPos - ((constants.SCREEN_WIDTH / 2) + 75),
        0,
        true);
      this.player = new Player({
        x: this.checkpointXPos,
        y: 0,
        diameter: constants.PLAYER_DIAMETER,
        health: 1
      });
    } else {
      this.viewBox = new ViewBox(
        levelMiddleXPos,
        0,
        true);
      this.player = new Player({
        x: levelMiddleXPos + (constants.SCREEN_WIDTH / 2) + 75,
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

    let levelFloorXPosReference = this.setupActivateStartWrongSection(levelMiddleXPos);
    levelFloorXPosReference = this.setupActivateMiddleWrongSection(levelFloorXPosReference + 750);
    this.setupActivateEndWrongSection(levelFloorXPosReference + 250);

    levelFloorXPosReference = this.setupActivateStartCorrectSection(levelMiddleXPos);
    levelFloorXPosReference = this.setupActivateMiddleCorrectSection(levelFloorXPosReference - 750);
    this.setupActivateEndCorrectSection(levelFloorXPosReference - 250);
  }

  /* ****** WRONG SECTION ****** */

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateStartWrongSection(startXPos: number): number {
    const sectionFloorXOffset = 1000;
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      isFloorBoundary: true
    }));

    // level half split boundary
    this.levelDrawableCollection.addDrawable(new VerticalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      y2Offset: -constants.LEVEL_FLOOR_Y_POSITION
    }));

    // invincible enemies above divider wall
    for (let i = 0; i < 5; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy({
        x: (startXPos + 2 * constants.SMALL_ENEMY_DIAMETER) - (i * constants.SMALL_ENEMY_DIAMETER),
        y: (constants.SCREEN_HEIGHT - platformer.getCurrentActiveLevelHeight()) / 2,
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: 0,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false,
        isInvulnerable: true
      }));
    }

    this.levelDrawableCollection.addDrawable(new Enemy({
      x: startXPos + (constants.BIG_ENEMY_DIAMETER / 2),
      y: 0,
      diameter: constants.BIG_ENEMY_DIAMETER,
      horizontalVel: constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      isInvulnerable: true
    }));

    for (let i = 0; i < 7; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy({
        x: startXPos + 1100 + i * (constants.SMALL_ENEMY_DIAMETER + 30),
        y: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: 0,
        verticalVel: constants.ENEMY_SLOW_MOVEMENT_SPEED,
        topYLimit: 200,
        bottomYLimit: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false
      }));
    }

    return startXPos + sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateMiddleWrongSection(startXPos: number): number {
    const sectionFloorXOffset = 2000;
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      isFloorBoundary: true
    }));

    // item block before stair section
    const healthItemForBlock = new HealthItem({
      healthChangeAmount: -1,
      leftX: 0,
      topY: 0,
      width: constants.HEALTH_ITEM_SIZE,
      height: constants.HEALTH_ITEM_SIZE,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable((healthItemForBlock));
    this.levelDrawableCollection.addDrawable(new ItemBlock({
      leftX: startXPos + 250,
      topY: constants.LEVEL_FLOOR_Y_POSITION - 3 * constants.DEFAULT_BLOCK_SIZE,
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_BLOCK_SIZE,
      item: healthItemForBlock
    }));

    // stair section
    for (let i = 0; i < 3; i++) {
      this.levelDrawableCollection.addDrawable(new Block({
        leftX: startXPos + 500 + (i + 1) * constants.DEFAULT_BLOCK_SIZE,
        topY: mainSketch.height - (i + 2) * constants.DEFAULT_BLOCK_SIZE,
        width: constants.DEFAULT_BLOCK_SIZE,
        height: (i + 1) * constants.DEFAULT_BLOCK_SIZE
      }));
    }

    const enemyToAddForTrigger = new Enemy({
      x: startXPos + 2000,
      y: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
      diameter: constants.SMALL_ENEMY_DIAMETER,
      horizontalVel: -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + 500 + 4 * constants.DEFAULT_BLOCK_SIZE + 2 * constants.DEFAULT_BLOCK_SIZE,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyToAddForTrigger
    }));

    return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndWrongSection(startXPos: number): void {
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: platformer.getCurrentActiveLevelWidth() - startXPos - 2 * constants.PLAYER_DIAMETER,
      isFloorBoundary: true
    }));

    this.levelDrawableCollection.addDrawable(new EventBlock({ // launch event
      leftX: startXPos,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      launchEventVerticalVelocity: constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY,
      isEventTriggerFloorBoundary: true
    }));

    // enemies at end
    const enemyAtEndToTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 2; i++) {
      const enemyToAdd = new FlyingEnemy({
        x: platformer.getCurrentActiveLevelWidth() - (i + 1) * constants.SMALL_ENEMY_DIAMETER,
        y: constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2),
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: true,
        isAffectedByVerticalBoundaries: true,
        initAsActive: false
      });
      this.levelDrawableCollection.addDrawable(enemyToAdd);
      enemyAtEndToTrigger.add(enemyToAdd);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos + constants.DEFAULT_EVENT_BLOCK_WIDTH,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyAtEndToTrigger
    }));
  }

  /* ****** CORRECT SECTION ****** */

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateStartCorrectSection(startXPos: number): number {
    const sectionFloorXOffset = -1000;
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      isFloorBoundary: true
    }));

    const enemyToAddForTrigger = new Enemy({
      x: startXPos - 700,
      y: 0,
      diameter: constants.BIG_ENEMY_DIAMETER,
      horizontalVel: constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      isInvulnerable: true,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos - 500,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyToAddForTrigger 
    }));

    for (let i = 0; i < 7; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy({
        x: startXPos - (1100 + i * (constants.SMALL_ENEMY_DIAMETER + 30)),
        y: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: 0,
        verticalVel: constants.ENEMY_SLOW_MOVEMENT_SPEED,
        topYLimit: 200,
        bottomYLimit: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        isAffectedByHorizontalBoundaries: false,
        isAffectedByVerticalBoundaries: false,
        isInvulnerable: i % 2 == 0
      }));
    }

    return startXPos + sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateMiddleCorrectSection(startXPos: number): number {
    const sectionFloorXOffset = -2000;
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: sectionFloorXOffset,
      isFloorBoundary: true
    }));

    // item block before stair section
    let healthItemForBlock = new HealthItem({
      healthChangeAmount: -1,
      leftX: 0,
      topY: 0,
      width: constants.HEALTH_ITEM_SIZE,
      height: constants.HEALTH_ITEM_SIZE,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable((healthItemForBlock));
    this.levelDrawableCollection.addDrawable(new ItemBlock({
      leftX: startXPos - 250 - constants.DEFAULT_BLOCK_SIZE,
      topY: constants.LEVEL_FLOOR_Y_POSITION - 3 * constants.DEFAULT_BLOCK_SIZE,
      width: constants.DEFAULT_BLOCK_SIZE,
      height: constants.DEFAULT_BLOCK_SIZE,
      item: healthItemForBlock
    }));

    // stair section
    let leftXPosOfStairsSection = 0;
    for (let i = 0; i < 3; i++) {
      leftXPosOfStairsSection = startXPos - (500 + (i + 2) * constants.DEFAULT_BLOCK_SIZE);
      this.levelDrawableCollection.addDrawable(new Block({
        leftX: leftXPosOfStairsSection,
        topY: mainSketch.height - (i + 2) * constants.DEFAULT_BLOCK_SIZE,
        width: constants.DEFAULT_BLOCK_SIZE,
        height: (i + 1) * constants.DEFAULT_BLOCK_SIZE
      }));
    }

    const enemyToAddForTrigger = new Enemy({
      x: startXPos - 2000,
      y: constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
      diameter: constants.SMALL_ENEMY_DIAMETER,
      horizontalVel: constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      initAsActive: false
    });
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos - (500 + 4 * constants.DEFAULT_BLOCK_SIZE) - 2 * constants.DEFAULT_BLOCK_SIZE,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyToAddForTrigger
    }));

    // calculated using distance from pit to start from left most x pos of stairs
    const numTimesBlockIterate =
      ((Math.abs(sectionFloorXOffset) - (startXPos - leftXPosOfStairsSection)) /
        constants.DEFAULT_BLOCK_SIZE) - 1; // -1 to not have block at end
    for (let i = 0; i < numTimesBlockIterate; i++) {
      if (i == 0) { // block closest to stairs is item block
        healthItemForBlock = new HealthItem({
          healthChangeAmount: 1,
          leftX: 0,
          topY: 0,
          width: constants.HEALTH_ITEM_SIZE,
          height: constants.HEALTH_ITEM_SIZE,
          initAsActive: false
        });
        this.levelDrawableCollection.addDrawable((healthItemForBlock));
        this.levelDrawableCollection.addDrawable(new ItemBlock({
          leftX: leftXPosOfStairsSection - (i + 1) * constants.DEFAULT_BLOCK_SIZE, // start from left most x pos of stairs
          topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_BLOCK_SIZE - constants.PLAYER_DIAMETER - 10,
          width: constants.DEFAULT_BLOCK_SIZE,
          height: constants.DEFAULT_BLOCK_SIZE,
          item: healthItemForBlock,
          isVisible: false,
          isBreakableFromBottom: false
        }));
      } else {
        this.levelDrawableCollection.addDrawable(new Block({
          leftX: leftXPosOfStairsSection - (i + 1) * constants.DEFAULT_BLOCK_SIZE, // start from left most x pos of stairs
          topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_BLOCK_SIZE - constants.PLAYER_DIAMETER - 10,
          width: constants.DEFAULT_BLOCK_SIZE,
          height: constants.DEFAULT_BLOCK_SIZE,
          isVisible: false
        }));
      }
    }

    return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndCorrectSection(startXPos: number): void {
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary({
      startXPoint: startXPos,
      startYPoint: constants.LEVEL_FLOOR_Y_POSITION,
      x2Offset: -(platformer.getCurrentActiveLevelWidth() - (platformer.getCurrentActiveLevelWidth() / 2 + 1750 + 2250) - 2 * constants.PLAYER_DIAMETER),
      isFloorBoundary: true
    }));

    // event block with invincible enemy
    const eventBlockInvulnerableEnemyXReference = startXPos - constants.DEFAULT_EVENT_BLOCK_WIDTH;
    this.levelDrawableCollection.addDrawable(new EventBlock({ // launch event
      leftX: eventBlockInvulnerableEnemyXReference,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      width: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      height: constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      launchEventVerticalVelocity: constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY,
      isEventTriggerFloorBoundary: true
    }));
    this.levelDrawableCollection.addDrawable(new Enemy({
      x: eventBlockInvulnerableEnemyXReference + (constants.DEFAULT_EVENT_BLOCK_WIDTH / 2),
      y: constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT - constants.SMALL_ENEMY_DIAMETER,
      diameter: constants.DEFAULT_EVENT_BLOCK_WIDTH,
      horizontalVel: 0,
      isInvulnerable: true,
      isVisible: false
    }));

    // enemies at end
    const enemyAtEndToTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 2; i++) {
      const enemyToAdd = new FlyingEnemy({
        x: (i + 1) * constants.SMALL_ENEMY_DIAMETER,
        y: constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2),
        diameter: constants.SMALL_ENEMY_DIAMETER,
        horizontalVel: constants.ENEMY_REGULAR_MOVEMENT_SPEED,
        verticalVel: 0,
        isAffectedByHorizontalBoundaries: true,
        isAffectedByVerticalBoundaries: true,
        isInvulnerable: true,
        initAsActive: false
      });
      this.levelDrawableCollection.addDrawable(enemyToAdd);
      enemyAtEndToTrigger.add(enemyToAdd);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary({
      startXPoint: startXPos - constants.DEFAULT_EVENT_BLOCK_WIDTH,
      startYPoint: 0,
      y2Offset: constants.LEVEL_FLOOR_Y_POSITION,
      enemy: enemyAtEndToTrigger
    }));

    // correct goal post
    this.levelDrawableCollection.addDrawable(new LevelGoal({
      leftX: constants.LEVEL_GOAL_WIDTH + 4 * constants.PLAYER_DIAMETER,
      topY: constants.LEVEL_FLOOR_Y_POSITION - constants.LEVEL_GOAL_HEIGHT,
      width: constants.LEVEL_GOAL_WIDTH,
      height: constants.LEVEL_GOAL_HEIGHT
    }));
  }

}