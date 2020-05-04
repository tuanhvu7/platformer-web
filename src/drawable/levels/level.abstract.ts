import { IDrawable } from "../drawable.interface";
import { IKeyControllable } from "../key-controllable.interface";
import { mainSketch } from "../../main";
import { platformer } from '../../platformer';
import { Constants } from "../../const/constants";
import { ResourceUtils } from "../../utils/resource-utils";
import { LevelDrawableCollection } from "./level-drawable-collection";
import { LevelGoal } from "../collectables/level-goal";
import { VerticalBoundary } from "../boundaries/vertical-boundary";
import { Player } from "../characters/player";
import { ViewBox } from "../viewbox/viewbox";
import { PauseMenu } from "../menus/pause-menu";
import { ESongType } from "../../enums/song-type.enum";

/**
 * common for levels
 */
export abstract class ALevel implements IDrawable, IKeyControllable {

  // player-controllable character
  player: Player;

  // level viewbox
  viewBox: ViewBox;

  // drawables in this
  readonly levelDrawableCollection: LevelDrawableCollection;

  // checkpoint x position
  checkpointXPos: number;

  // true means load player at checkpoint position
  loadPlayerFromCheckPoint: boolean;

  // pause menu for level
  private pauseMenu: PauseMenu;

  // true means level is paused and menu appears
  private isPaused: boolean;

  // true means running handleLevelComplete thread
  private handlingLevelComplete: boolean;

  /**
   * sets properties of this
   */
  constructor(isActive: boolean, loadPlayerFromCheckPoint: boolean, goalRightSideOffsetWithStageWidth: number) {

    this.levelDrawableCollection = new LevelDrawableCollection();

    this.isPaused = false;

    this.loadPlayerFromCheckPoint = loadPlayerFromCheckPoint;

    this.handlingLevelComplete = false;

    if (isActive) {
      this.setUpActivateLevel();
      this.setUpActivateWallsGoal(goalRightSideOffsetWithStageWidth);
    }
  }

  /**
   * active and add this to game
   */
  makeActive(): void {
    platformer.addToAllKeyControllables(this); // connect this keyEvent() from main keyEvent()
    platformer.addToAllDrawables(this); // connect this draw() from main draw()
  }

  /**
   * setup and activate this; to override in extended classes
   */
  abstract setUpActivateLevel(): void;

  /**
   * handle conditional enemy triggers in this;
   * to override in extended classes if needed
   */
  handleConditionalEnemyTriggers(): void {}

  /**
   * deactivate this;
   */
  public deactivateLevel(): void {
    if (this.player != null) {
      this.player.makeNotActive();
    }

    this.viewBox.makeNotActive();

    this.levelDrawableCollection.deactivateClearAllDrawable();

    // make this not active
    platformer.deleteFromAllKeyControllables(this); // connect this keyEvent() from main keyEvent()
    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
  }

  /**
   * close pause menu
   */
  public closePauseMenu(): void {
    this.pauseMenu.deactivateMenu();
  }

  /**
   * runs continuously
   */
  public draw(): void {
    // for scrolling background
    mainSketch.translate(-this.viewBox.getPos().x, -this.viewBox.getPos().y);

    let levelWidthLeftToDraw: number = platformer.getCurrentActiveLevelWidth();
    const numberHorizontalBackgroundIterations =
      Math.ceil(platformer.getCurrentActiveLevelWidth() / Constants.SCREEN_WIDTH);
    for (let curHorizontalItr = 0; curHorizontalItr < numberHorizontalBackgroundIterations; curHorizontalItr++) {
      const curIterationWidthToDraw =
        Math.min(
          Constants.SCREEN_WIDTH,
          levelWidthLeftToDraw);

      // lazy load level background
      const curItrLeftX = curHorizontalItr * Constants.SCREEN_WIDTH;
      const viewBoxInCurXRange =
        (curItrLeftX <= this.viewBox.getPos().x &&
          curItrLeftX + Constants.SCREEN_WIDTH >= this.viewBox.getPos().x) ||
        (curItrLeftX <= this.viewBox.getPos().x + Constants.SCREEN_WIDTH &&
          curItrLeftX + Constants.SCREEN_WIDTH >= this.viewBox.getPos().x + Constants.SCREEN_WIDTH);

      if (viewBoxInCurXRange) {
        let levelHeightLeftToDraw: number = platformer.getCurrentActiveLevelHeight();
        const numberVerticalBackgroundIterations =
          Math.ceil(platformer.getCurrentActiveLevelHeight() / Constants.SCREEN_HEIGHT);

        for (let curVerticalItr = 0; curVerticalItr < numberVerticalBackgroundIterations; curVerticalItr++) {
          const curIterationHeightToDraw: number =
            Math.min(
              Constants.SCREEN_HEIGHT,
              levelHeightLeftToDraw);

          const startYPosToDraw: number = -curVerticalItr * Constants.SCREEN_HEIGHT +
            (Constants.SCREEN_HEIGHT - curIterationHeightToDraw);

          mainSketch.image(
            ResourceUtils.LEVEL_BACKGROUND_IMAGE,
            (curHorizontalItr * Constants.SCREEN_WIDTH), // start x pos
            startYPosToDraw, // start y pos
            curIterationWidthToDraw,
            curIterationHeightToDraw,

            0,
            0,
            curIterationWidthToDraw,
            curIterationHeightToDraw);

          levelHeightLeftToDraw -= curIterationHeightToDraw;
        }
      }
      levelWidthLeftToDraw -= curIterationWidthToDraw;
    }

    this.handleConditionalEnemyTriggers();
  }

  /**
   * handle character keypress controls
   */
  public keyPressed(): void {
    if (this.player != null && !this.handlingLevelComplete) { // only allow pause if player is active
      const keyPressed = mainSketch.key;
      if (ReservedControlUtils.EReservedControlKeys.p.toString().equalsIgnoreCase(keyPressed)) { // pause
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
          ResourceUtils.stopSong();
          mainSketch.noLoop();
          this.pauseMenu = new PauseMenu(
            Math.floor(this.viewBox.getPos().x),
            true);

        } else {
          ResourceUtils.loopSong(ESongType.LEVEL);
          mainSketch.loop();
          this.closePauseMenu();
        }
      }
    }
  }

  /**
   * setup activate walls, and goal
   *
   * @param goalRightSideOffsetWithStageWidth offset of goal's right side relative to stage width
   *                                          (example: 50 means goal is 50 pixels less than stage width
   */
  private setUpActivateWallsGoal(goalRightSideOffsetWithStageWidth: number): void {
    // stage goal
    this.levelDrawableCollection.addDrawable(new LevelGoal(
      platformer.getCurrentActiveLevelWidth() - Constants.LEVEL_GOAL_WIDTH - goalRightSideOffsetWithStageWidth,
      Constants.LEVEL_FLOOR_Y_POSITION - Constants.LEVEL_GOAL_HEIGHT,
      Constants.LEVEL_GOAL_WIDTH,
      Constants.LEVEL_GOAL_HEIGHT,
      Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true));

    // stage right and left walls
    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      0,
      0,
      Constants.LEVEL_FLOOR_Y_POSITION,
      Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true
    ));

    this.levelDrawableCollection.addDrawable(new VerticalBoundary(
      platformer.getCurrentActiveLevelWidth(),
      0,
      Constants.LEVEL_FLOOR_Y_POSITION,
      Constants.DEFAULT_BOUNDARY_LINE_THICKNESS,
      true
    ));
  }

  /*** getters and setters ***/
  public getPlayer(): Player {
    return this.player;
  }

  public setPlayer(player: Player): void {
    this.player = player;
  }

  public getViewBox(): ViewBox {
    return this.viewBox;
  }

  public getLevelDrawableCollection(): LevelDrawableCollection {
    return this.levelDrawableCollection;
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  public isLoadPlayerFromCheckPoint(): boolean {
    return this.loadPlayerFromCheckPoint;
  }

  public setLoadPlayerFromCheckPoint(loadPlayerFromCheckPoint: boolean): void {
    this.loadPlayerFromCheckPoint = loadPlayerFromCheckPoint;
  }

  public isHandlingLevelComplete(): boolean {
    return this.handlingLevelComplete;
  }

  public setHandlingLevelComplete(handlingLevelComplete: boolean): void {
    this.handlingLevelComplete = handlingLevelComplete;
  }
}