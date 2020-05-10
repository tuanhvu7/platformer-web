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
  constructor(isActive: boolean, loadPlayerFromCheckPoint: boolean) {
    super(isActive, loadPlayerFromCheckPoint, 4 * constants.PLAYER_DIAMETER);
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
      this.player = new Player(
        this.checkpointXPos,
        0,
        constants.PLAYER_DIAMETER,
        1,
        true);
    } else {
      this.viewBox = new ViewBox(
        levelMiddleXPos,
        0,
        true);
      this.player = new Player(
        levelMiddleXPos + (constants.SCREEN_WIDTH / 2) + 75,
        0,
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

    // level half split boundary
    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      startXPos,
      constants.LEVEL_FLOOR_Y_POSITION,
      -constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true
    ));

    for (let i = 0; i < 5; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy(
        (startXPos + 2 * constants.SMALL_ENEMY_DIAMETER) - (i * constants.SMALL_ENEMY_DIAMETER),
        (constants.SCREEN_HEIGHT - platformer.getCurrentActiveLevelHeight()) / 2,
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

    this.levelDrawableCollection.addDrawable(new Enemy(
      startXPos + (constants.BIG_ENEMY_DIAMETER / 2),
      0,
      constants.BIG_ENEMY_DIAMETER,
      constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      true,
      true,
      true
    ));

    for (let i = 0; i < 7; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy(
        startXPos + 1100 + i * (constants.SMALL_ENEMY_DIAMETER + 30),
        constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        constants.SMALL_ENEMY_DIAMETER,
        0,
        constants.ENEMY_SLOW_MOVEMENT_SPEED,
        200,
        constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        false,
        false,
        false,
        true,
        true
      ));
    }

    return startXPos + sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateMiddleWrongSection(startXPos: number): number {
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

    // item block before stair section
    const healthItemForBlock = new HealthItem(
      -1,
      0,
      0,
      constants.HEALTH_ITEM_SIZE,
      constants.HEALTH_ITEM_SIZE,
      1,
      false
    );
    this.levelDrawableCollection.addDrawable((healthItemForBlock));
    this.levelDrawableCollection.addDrawable(new ItemBlock(
      startXPos + 250,
      constants.LEVEL_FLOOR_Y_POSITION - 3 * constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      healthItemForBlock,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      false,
      true
    ));

    // stair section
    for (let i = 0; i < 3; i++) {
      this.levelDrawableCollection.addDrawable(new Block(
        startXPos + 500 + (i + 1) * constants.DEFAULT_BLOCK_SIZE,
        mainSketch.height - (i + 2) * constants.DEFAULT_BLOCK_SIZE,
        constants.DEFAULT_BLOCK_SIZE,
        (i + 1) * constants.DEFAULT_BLOCK_SIZE,
        constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
        true,
        false,
        true
      ));
    }

    const enemyToAddForTrigger = new Enemy(
      startXPos + 2000,
      constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
      constants.SMALL_ENEMY_DIAMETER,
      -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      false,
      true,
      false
    );
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + 500 + 4 * constants.DEFAULT_BLOCK_SIZE + 2 * constants.DEFAULT_BLOCK_SIZE,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyToAddForTrigger
    ));

    return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndWrongSection(startXPos: number): void {
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      startXPos,
      constants.LEVEL_FLOOR_Y_POSITION,
      platformer.getCurrentActiveLevelWidth() - startXPos - 2 * constants.PLAYER_DIAMETER,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));

    this.levelDrawableCollection.addDrawable(new EventBlock( // launch event
      startXPos,
      constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_EVENT_BLOCK_WIDTH,
      constants.DEFAULT_EVENT_BLOCK_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      [constants.CHARACTER_LAUNCH_EVENT_VERTICAL_VELOCITY],
      true,
      true
    ));

    // enemies at end
    const enemyAtEndToTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 2; i++) {
      const enemyToAdd = new FlyingEnemy(
        platformer.getCurrentActiveLevelWidth() - (i + 1) * constants.SMALL_ENEMY_DIAMETER,
        constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2),
        constants.SMALL_ENEMY_DIAMETER,
        -constants.ENEMY_REGULAR_MOVEMENT_SPEED,
        0,
        null,
        null,
        true,
        true,
        false,
        true,
        false
      );
      this.levelDrawableCollection.addDrawable(enemyToAdd);
      enemyAtEndToTrigger.add(enemyToAdd);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos + constants.DEFAULT_EVENT_BLOCK_WIDTH,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyAtEndToTrigger
    ));
  }

  /* ****** CORRECT SECTION ****** */

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateStartCorrectSection(startXPos: number): number {
    const sectionFloorXOffset = -1000;
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

    const enemyToAddForTrigger = new Enemy(
      startXPos - 700,
      0,
      constants.BIG_ENEMY_DIAMETER,
      constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      true,
      true,
      false);
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos - 500,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyToAddForTrigger
    ));

    for (let i = 0; i < 7; i++) {
      this.levelDrawableCollection.addDrawable(new FlyingEnemy(
        startXPos - (1100 + i * (constants.SMALL_ENEMY_DIAMETER + 30)),
        constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        constants.SMALL_ENEMY_DIAMETER,
        0,
        constants.ENEMY_SLOW_MOVEMENT_SPEED,
        200,
        constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
        false,
        false,
        i % 2 == 0,
        true,
        true
      ));
    }

    return startXPos + sectionFloorXOffset;
  }

  /**
   * @return sum of given startXPos and section floor x offset
   */
  private setupActivateMiddleCorrectSection(startXPos: number): number {
    const sectionFloorXOffset = -2000;
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

    // item block before stair section
    let healthItemForBlock = new HealthItem(
      -1,
      0,
      0,
      constants.HEALTH_ITEM_SIZE,
      constants.HEALTH_ITEM_SIZE,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      false
    );
    this.levelDrawableCollection.addDrawable((healthItemForBlock));
    this.levelDrawableCollection.addDrawable(new ItemBlock(
      startXPos - 250 - constants.DEFAULT_BLOCK_SIZE,
      constants.LEVEL_FLOOR_Y_POSITION - 3 * constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      constants.DEFAULT_BLOCK_SIZE,
      healthItemForBlock,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      false,
      true
    ));

    // stair section
    let leftXPosOfStairsSection = 0;
    for (let i = 0; i < 3; i++) {
      leftXPosOfStairsSection = startXPos - (500 + (i + 2) * constants.DEFAULT_BLOCK_SIZE);
      this.levelDrawableCollection.addDrawable(new Block(
        leftXPosOfStairsSection,
        mainSketch.height - (i + 2) * constants.DEFAULT_BLOCK_SIZE,
        constants.DEFAULT_BLOCK_SIZE,
        (i + 1) * constants.DEFAULT_BLOCK_SIZE,
        constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
        true,
        false,
        true
      ));
    }

    const enemyToAddForTrigger = new Enemy(
      startXPos - 2000,
      constants.LEVEL_FLOOR_Y_POSITION - constants.SMALL_ENEMY_DIAMETER,
      constants.SMALL_ENEMY_DIAMETER,
      constants.ENEMY_REGULAR_MOVEMENT_SPEED,
      false,
      true,
      false
    );
    this.levelDrawableCollection.addDrawable(enemyToAddForTrigger);
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos - (500 + 4 * constants.DEFAULT_BLOCK_SIZE) - 2 * constants.DEFAULT_BLOCK_SIZE,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyToAddForTrigger
    ));

    // calculated using distance from pit to start from left most x pos of stairs
    const numTimesBlockIterate =
      ((Math.abs(sectionFloorXOffset) - (startXPos - leftXPosOfStairsSection)) /
        constants.DEFAULT_BLOCK_SIZE) - 1; // -1 to not have block at end
    for (let i = 0; i < numTimesBlockIterate; i++) {
      if (i == 0) { // block closest to stairs is item block
        healthItemForBlock = new HealthItem(
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
          leftXPosOfStairsSection - (i + 1) * constants.DEFAULT_BLOCK_SIZE, // start from left most x pos of stairs
          constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_BLOCK_SIZE - constants.PLAYER_DIAMETER - 10,
          constants.DEFAULT_BLOCK_SIZE,
          constants.DEFAULT_BLOCK_SIZE,
          healthItemForBlock,
          constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          false,
          false,
          true
        ));
      } else {
        this.levelDrawableCollection.addDrawable(new Block(
          leftXPosOfStairsSection - (i + 1) * constants.DEFAULT_BLOCK_SIZE, // start from left most x pos of stairs
          constants.LEVEL_FLOOR_Y_POSITION - constants.DEFAULT_BLOCK_SIZE - constants.PLAYER_DIAMETER - 10,
          constants.DEFAULT_BLOCK_SIZE,
          constants.DEFAULT_BLOCK_SIZE,
          constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
          false,
          false,
          true
        ));
      }
    }

    return startXPos + sectionFloorXOffset;
  }

  private setupActivateEndCorrectSection(startXPos: number): void {
    // section floor
    this.levelDrawableCollection.addDrawable(new HorizontalBoundary(
      startXPos,
      constants.LEVEL_FLOOR_Y_POSITION,
      -(platformer.getCurrentActiveLevelWidth() - (platformer.getCurrentActiveLevelWidth() / 2 + 1750 + 2250) - 2 * constants.PLAYER_DIAMETER),
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      true,
      true,
      true,
      true
    ));

    // event block with invincible enemy
    const eventBlockInvulnerableEnemyXReference = startXPos - constants.DEFAULT_EVENT_BLOCK_WIDTH;
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

    // enemies at end
    const enemyAtEndToTrigger: Set<Enemy> = new Set();
    for (let i = 0; i < 2; i++) {
      const enemyToAdd = new FlyingEnemy(
        (i + 1) * constants.SMALL_ENEMY_DIAMETER,
        constants.LEVEL_FLOOR_Y_POSITION - (constants.SMALL_ENEMY_DIAMETER / 2),
        constants.SMALL_ENEMY_DIAMETER,
        constants.ENEMY_REGULAR_MOVEMENT_SPEED,
        0,
        null,
        null,
        true,
        true,
        true,
        true,
        false
      );
      this.levelDrawableCollection.addDrawable(enemyToAdd);
      enemyAtEndToTrigger.add(enemyToAdd);
    }
    this.levelDrawableCollection.addDrawable(new EnemyTriggerVerticalBoundary(
      startXPos - constants.DEFAULT_EVENT_BLOCK_WIDTH,
      0,
      constants.LEVEL_FLOOR_Y_POSITION,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true,
      enemyAtEndToTrigger
    ));

    // correct goal post
    this.levelDrawableCollection.addDrawable(new LevelGoal(
      constants.LEVEL_GOAL_WIDTH + 4 * constants.PLAYER_DIAMETER,
      constants.LEVEL_FLOOR_Y_POSITION - constants.LEVEL_GOAL_HEIGHT,
      constants.LEVEL_GOAL_WIDTH,
      constants.LEVEL_GOAL_HEIGHT,
      constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true));
  }

}