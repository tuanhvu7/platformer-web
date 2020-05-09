import { Image } from 'p5';
import { ESongType } from '../enums/song-type.enum';
import { SoundUtils } from './sound-utils';
import { mainSketch } from '../main';

/**
 * make this class "static"
 */
export class ResourceUtils {
  public static readonly DEFAULT_MENU_IMAGE_PATH = '/assets/sky-blue-bg.png';
  public static DEFAULT_MENU_IMAGE: Image;

  public static readonly LEVEL_BACKGROUND_IMAGE_PATH = "/assets/sky-bg.png";
  public static LEVEL_BACKGROUND_IMAGE: Image;

  // out-of-level menu song
  private static readonly OUT_OF_LEVEL_MENU_SONG_PATH: string = "/assets/level-select-menu-song.mp3";
  // private static readonly Media OUT_OF_LEVEL_MENU_SONG = new Media(
  //     getResourcePathUri(OUT_OF_LEVEL_MENU_SONG_PATH));
  private static OUT_OF_LEVEL_MENU_SONG: AudioBufferSourceNode;

  // level song
  private static readonly LEVEL_SONG_PATH = "/assets/level-song.mp3";
  private static LEVEL_SONG: AudioBufferSourceNode;

  // player damage song
  private static readonly PLAYER_DAMAGE_SONG_PATH = "/assets/player-damage-song.mp3";
  private static PLAYER_DAMAGE_SONG: AudioBufferSourceNode;

  // player death song
  private static readonly PLAYER_DEATH_SONG_PATH = "/assets/player-death-song.mp3";;
  private static PLAYER_DEATH_SONG: AudioBufferSourceNode;

  // level complete song
  private static readonly LEVEL_COMPLETE_SONG_PATH = "/assets/level-complete-song.mp3";
  private static LEVEL_COMPLETE_SONG: AudioBufferSourceNode;

  // player action song
  private static readonly PLAYER_ACTION_SONG_PATH = "/assets/player-action-song.mp3";
  private static PLAYER_ACTION_SONG: AudioBufferSourceNode;

  // event block descent song
  private static readonly EVENT_BLOCK_DESCENT_SONG_PATH = "/assets/event-block-descent-song.mp3";
  private static EVENT_BLOCK_DESCENT_SONG: AudioBufferSourceNode;

  /**
   * Fetch and set images used in app
   */
  public static fetchImages(): void {
    ResourceUtils.DEFAULT_MENU_IMAGE = mainSketch.loadImage(ResourceUtils.DEFAULT_MENU_IMAGE_PATH);
    ResourceUtils.LEVEL_BACKGROUND_IMAGE = mainSketch.loadImage(ResourceUtils.LEVEL_BACKGROUND_IMAGE_PATH);
  }

  /**
   * Fetch and set songs used in app
   */
  public static async fetchSongs(): Promise<void> {
    ResourceUtils.OUT_OF_LEVEL_MENU_SONG = await SoundUtils.getSoundFile(this.OUT_OF_LEVEL_MENU_SONG_PATH);
    ResourceUtils.LEVEL_SONG = await SoundUtils.getSoundFile(this.LEVEL_SONG_PATH);;
    ResourceUtils.PLAYER_DAMAGE_SONG = await SoundUtils.getSoundFile(this.PLAYER_DAMAGE_SONG_PATH);;
    ResourceUtils.PLAYER_DEATH_SONG = await SoundUtils.getSoundFile(this.PLAYER_DEATH_SONG_PATH);;
    ResourceUtils.LEVEL_COMPLETE_SONG = await SoundUtils.getSoundFile(this.LEVEL_COMPLETE_SONG_PATH);;
    ResourceUtils.PLAYER_ACTION_SONG = await SoundUtils.getSoundFile(this.PLAYER_ACTION_SONG_PATH);;
    ResourceUtils.EVENT_BLOCK_DESCENT_SONG = await SoundUtils.getSoundFile(this.EVENT_BLOCK_DESCENT_SONG_PATH);;
  }

  /**
   * loop song
   */
  public static loopSong(songType: ESongType): void {
    switch (songType) {
      case ESongType.OUT_OF_LEVEL_MENU:
        SoundUtils.loopSong(this.OUT_OF_LEVEL_MENU_SONG);
        break;

      case ESongType.LEVEL:
        SoundUtils.loopSong(this.LEVEL_SONG);
        break;

      default:
        break;
    }
  }

  /**
   * play song
   */
  public static playSong(songType: ESongType): void {
    switch (songType) {
      case ESongType.PLAYER_DEATH:
        SoundUtils.playSong(this.PLAYER_DEATH_SONG);
        break;

      case ESongType.LEVEL_COMPLETE:
        SoundUtils.playSong(this.LEVEL_COMPLETE_SONG);
        break;

      case ESongType.PLAYER_DAMAGE:
        SoundUtils.playSong(this.PLAYER_DAMAGE_SONG);
        // setTimeout(
        //   () => {
        //     this.PLAYER_DAMAGE_SONG.stop();
        //   },
        //   this.PLAYER_DAMAGE_SONG.duration // wait for song duration
        // );
        break;

      case ESongType.PLAYER_ACTION:
        // to reset level after player death song finishes without freezing game
        SoundUtils.playSong(this.PLAYER_ACTION_SONG);
        // setTimeout(
        //   () => {
        //     this.PLAYER_ACTION_SONG.stop();
        //   },
        //   this.PLAYER_ACTION_SONG.duration // wait for song duration
        // );
        break;

      case ESongType.EVENT_BLOCK_DESCENT:
        // to play event block descent song in parallel with level song
        SoundUtils.playSong(this.EVENT_BLOCK_DESCENT_SONG);
        // setTimeout(
        //   () => {
        //     this.EVENT_BLOCK_DESCENT_SONG.stop();;
        //   },
        //   this.EVENT_BLOCK_DESCENT_SONG.getDuration().toMillis() // wait for song duration
        // );
        break;

      default:
        break;
    }
  }

  /**
   * get song duration in milliseconds
   */
  public static getSongDurationMilliSec(songType: ESongType): number {
    switch (songType) {
      case ESongType.PLAYER_DEATH:
        return this.PLAYER_DEATH_SONG.buffer.duration * 1000;
      case ESongType.PLAYER_DAMAGE:
        return this.PLAYER_DAMAGE_SONG.buffer.duration * 1000;
      case ESongType.LEVEL_COMPLETE:
        return this.LEVEL_COMPLETE_SONG.buffer.duration * 1000;
      default:
        return 0;
    }
  }

  /**
   * stop song
   */
  public static stopSong(): void {
    this.OUT_OF_LEVEL_MENU_SONG.stop();
    this.LEVEL_SONG.stop();
    this.PLAYER_DEATH_SONG.stop();
    this.LEVEL_COMPLETE_SONG.stop();
    this.PLAYER_ACTION_SONG.stop();
    this.EVENT_BLOCK_DESCENT_SONG.stop();
  }

  /**
   * make class 'static'
   */
  private constructor() {}
}