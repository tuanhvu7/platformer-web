import { constants } from './const/constants';
import { ResourceUtils } from './utils/resource-utils';
import { IDrawable } from './drawable/drawable.interface';
import { IKeyControllable } from './drawable/key-controllable.interface';
import { IMouseControllable } from './drawable/mouse-controllable.interface';
import { LevelSelectMenu } from './drawable/menus/level-select-menu';
import { LevelDrawableCollection } from './drawable/levels/level-drawable-collection';
import { ALevel } from './drawable/levels/level.abstract';
import { Player } from './drawable/characters/player';
import { ViewBox } from './drawable/viewbox/viewbox';
import { ConfigurePlayerControlMenu } from './drawable/menus/configure-player-control-menu';
import p5 from 'p5';
import { ESongType } from './enums/song-type.enum';
import { levelFactory } from './drawable/levels/level.factory';
import { mainSketch } from './main';

/**
 * Contains controls for running app
 */
class Platformer {
  // level select menu
  private levelSelectMenu: LevelSelectMenu;

  // set control menu
  private configurePlayerControlMenu: ConfigurePlayerControlMenu;

  // stores current active level
  private currentActiveLevel: ALevel;

  // stores currently active level number
  private currentActiveLevelNumber: number;

  // timer to handle level completion; stored in variable to be able interrupt
  private levelCompleteTimer: NodeJS.Timeout | undefined;


  private allDrawables: Set < IDrawable > = new Set();
  private allKeyControllables: Set < IKeyControllable > = new Set();
  private allMouseControllables: Set < IMouseControllable > = new Set();

  /**
   * For p5.js
   */
  public sketch = (mainSketch: p5): void => {
    mainSketch.preload = () => {
      ResourceUtils.fetchImages();
    }

    mainSketch.setup = async () => {
      await ResourceUtils.fetchSongs();
      constants.setVectorProperties();
      mainSketch.createCanvas(constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT);
      this.levelSelectMenu = new LevelSelectMenu(true);
      this.configurePlayerControlMenu = new ConfigurePlayerControlMenu(false);
      // new MockMenu();
    };

    mainSketch.draw = () => {
      this.allDrawables.forEach((curDrawable: IDrawable) => {
        curDrawable.draw();
      });
    }

    mainSketch.keyPressed = () => {
      this.allKeyControllables.forEach((curKeyControllable: IKeyControllable) => {
        curKeyControllable.keyPressed();
      });
    }

    mainSketch.keyReleased = () => {
      this.allKeyControllables.forEach((curKeyControllable: IKeyControllable) => {
        if (curKeyControllable.keyReleased) {
          curKeyControllable.keyReleased();
        }
      });
    }

    mainSketch.mouseClicked = (event: MouseEvent) => {
      this.allMouseControllables.forEach((curMouseControllable: IMouseControllable) => {
        curMouseControllable.mouseClicked(event);
      });
    }
  }

  /**
   * reset level
   */
  public resetLevel(): void {
    // to reset level after player death song finishes without freezing game

    if (this.levelCompleteTimer) {
      clearTimeout(this.levelCompleteTimer);
      this.levelCompleteTimer = undefined;
    }

    this.getCurrentActivePlayer().makeNotActive();
    this.currentActiveLevel.setPlayer(null); // to stop interactions with player

    ResourceUtils.stopSong();
    ResourceUtils.playSong(ESongType.PLAYER_DEATH);

    setTimeout(
      () => {
        const loadPlayerFromCheckPoint = this.getCurrentActiveLevel().isLoadPlayerFromCheckPoint();
        this.getCurrentActiveLevel().deactivateLevel();
        this.currentActiveLevel = levelFactory.getLevel(true, loadPlayerFromCheckPoint);
      },
      ResourceUtils.getSongDurationMilliSec(ESongType.PLAYER_DEATH)
    );
  }

  /**
   * complete level
   */
  public handleLevelComplete(): void {
    this.getCurrentActiveLevel().setHandlingLevelComplete(true);
    this.getCurrentActivePlayer().resetControlPressed();
    this.getCurrentActivePlayer().setVel(mainSketch.createVector(constants.PLAYER_LEVEL_COMPLETE_SPEED, 0));
    this.deleteFromAllKeyControllables(this.getCurrentActivePlayer()) // disconnect this keyEvent() from main keyEvent()

    ResourceUtils.stopSong();
    ResourceUtils.playSong(ESongType.LEVEL_COMPLETE);
    this.levelCompleteTimer = setTimeout(
      () => {
        this.getCurrentActiveLevel().deactivateLevel();
        this.currentActiveLevelNumber = 0;
        this.levelSelectMenu.setupActivateMenu();
      },
      ResourceUtils.getSongDurationMilliSec(ESongType.LEVEL_COMPLETE)
    );
  }

  /** Getters, setters, and field modifiers **/
  public getLevelSelectMenu(): LevelSelectMenu {
    return this.levelSelectMenu;
  }

  public getChangePlayerControlMenu(): ConfigurePlayerControlMenu {
    return this.configurePlayerControlMenu;
  }

  public getCurrentActiveLevel(): ALevel {
    return this.currentActiveLevel;
  }


  public setCurrentActiveLevel(currentActiveLevel: ALevel): void {
    this.currentActiveLevel = currentActiveLevel;
  }

  public getCurrentActiveLevelNumber(): number {
    return this.currentActiveLevelNumber;
  }

  public setCurrentActiveLevelNumber(currentActiveLevelNumber: number): void {
    this.currentActiveLevelNumber = currentActiveLevelNumber;
  }

  /**
   * return player of current active level
   */
  public getCurrentActivePlayer(): Player {
    return this.currentActiveLevel.getPlayer();
  }

  /**
   * return viewbox of current active level
   */
  public getCurrentActiveViewBox(): ViewBox {
    return this.currentActiveLevel.getViewBox();
  }

  /**
   * return drawable collection of current active level
   */
  public getCurrentActiveLevelDrawableCollection(): LevelDrawableCollection {
    return this.currentActiveLevel.getLevelDrawableCollection();
  }

  /**
   * return width of current active level
   */
  public getCurrentActiveLevelWidth(): number {
    return constants.LEVELS_WIDTH_ARRAY[this.currentActiveLevelNumber];
  }

  /**
   * return height of current active level
   */
  public getCurrentActiveLevelHeight(): number {
    return constants.LEVELS_HEIGHT_ARRAY[this.currentActiveLevelNumber];
  }

  // Drawables
  public getAllDrawables(): Set<IDrawable> {
    return this.allDrawables;
  }

  public addToAllDrawables(drawable: IDrawable): void {
    this.allDrawables.add(drawable);
  }

  public deleteFromAllDrawables(drawable: IDrawable): void {
    this.allDrawables.delete(drawable);
  }

  // Key Controllables
  public getAllKeyControllables(): Set <IKeyControllable> {
    return this.allKeyControllables;
  }

  public addToAllKeyControllables(keyControllable: IKeyControllable): void {
    this.allKeyControllables.add(keyControllable);
  }

  public deleteFromAllKeyControllables(keyControllable: IKeyControllable): void {
    this.allKeyControllables.delete(keyControllable);
  }

  // Mouse Controllables
  public getAllMouseControllables(): Set<IMouseControllable> {
    return this.allMouseControllables;
  }

  public addToAllMouseControllables(mouseControllable: IMouseControllable): void {
    this.allMouseControllables.add(mouseControllable);
  }

  public deleteFromAllMouseControllables(mouseControllable: IMouseControllable): void {
    this.allMouseControllables.delete(mouseControllable);
  }

  /** END of getters, setters, and field modifiers **/
}

/**
 * Export to allow other classes run in Processing methods (draw, ect...)
 */
export const platformer = new Platformer();