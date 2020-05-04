import { Image } from 'p5';
import { ESongType } from '../enums/song-type.enum';

/**
 * make this class "static"
 */
export class ResourceUtils {
  public static readonly DEFAULT_MENU_IMAGE_PATH = '/assets/sky-blue-bg.png';
  public static DEFAULT_MENU_IMAGE: Image;

  public static readonly LEVEL_BACKGROUND_IMAGE_NAME = "sky-bg.png";
  public static readonly LEVEL_BACKGROUND_IMAGE: Image;

  // out-of-level menu song
  private static readonly OUT_OF_LEVEL_MENU_SONG_PATH: string = "level-select-menu-song.mp3";
  // private static readonly Media OUT_OF_LEVEL_MENU_SONG = new Media(
  //     getResourcePathUri(OUT_OF_LEVEL_MENU_SONG_PATH));
  private static readonly OUT_OF_LEVEL_MENU_SONG_PLAYER;

  // level song
  private static readonly LEVEL_SONG_PATH = "level-song.mp3";
  private static readonly LEVEL_SONG_PLAYER;

  // player damage song
  private static readonly PLAYER_DAMAGE_SONG_PATH = "player-damage-song.mp3";
  private static readonly PLAYER_DAMAGE_SONG_PLAYER;

  // player death song
  private static readonly PLAYER_DEATH_SONG_PATH = "player-death-song.mp3";;
  private static readonly PLAYER_DEATH_SONG_PLAYER;

  // level complete song
  private static readonly LEVEL_COMPLETE_SONG_PATH = "level-complete-song.mp3";
  private static readonly LEVEL_COMPLETION_SONG_PLAYER;

  // player action song
  private static readonly PLAYER_ACTION_SONG_PATH = "player-action-song.mp3";
  private static readonly PLAYER_ACTION_SONG_PLAYER;

  // event block descent song
  private static readonly EVENT_BLOCK_DESCENT_SONG_PATH = "event-block-descent-song.mp3";
  private static readonly EVENT_BLOCK_DESCENT_SONG_PLAYER;

  /**
   * loop song
   */
  public static loopSong(songType: ESongType): void {
    switch (songType) {
      case ESongType.OUT_OF_LEVEL_MENU:
        ResourceUtils.OUT_OF_LEVEL_MENU_SONG_PLAYER.setCycleCount(Integer.MAX_VALUE);
        ResourceUtils.OUT_OF_LEVEL_MENU_SONG_PLAYER.play();
        break;

      case ESongType.LEVEL:
        ResourceUtils.LEVEL_SONG_PLAYER.setCycleCount(Integer.MAX_VALUE);
        ResourceUtils.LEVEL_SONG_PLAYER.play();
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
        ResourceUtils.PLAYER_DEATH_SONG_PLAYER.setCycleCount(1);
        ResourceUtils.PLAYER_DEATH_SONG_PLAYER.play();
        break;

      case ESongType.LEVEL_COMPLETE:
        ResourceUtils.LEVEL_COMPLETION_SONG_PLAYER.setCycleCount(1);
        ResourceUtils.LEVEL_COMPLETION_SONG_PLAYER.play();
        break;

      case ESongType.PLAYER_DAMAGE:
        // to player damage song in parallel with level song
        ResourceUtils.PLAYER_DAMAGE_SONG_PLAYER.setCycleCount(1);
        ResourceUtils.PLAYER_DAMAGE_SONG_PLAYER.play();
        setTimeout(
          () => {
            ResourceUtils.PLAYER_DAMAGE_SONG_PLAYER.stop();
          },
          ResourceUtils.PLAYER_DAMAGE_SONG.getDuration().toMillis() // wait for song duration
        );
        break;

      case ESongType.PLAYER_ACTION:
        // to reset level after player death song finishes without freezing game
        ResourceUtils.PLAYER_ACTION_SONG_PLAYER.setCycleCount(1);
        ResourceUtils.PLAYER_ACTION_SONG_PLAYER.play();

        setTimeout(
          () => {
            ResourceUtils.PLAYER_ACTION_SONG_PLAYER.stop();
          },
          ResourceUtils.PLAYER_ACTION_SONG.getDuration().toMillis() // wait for song duration
        );
        break;

      case ESongType.EVENT_BLOCK_DESCENT:
        // to play event block descent song in parallel with level song
        ResourceUtils.EVENT_BLOCK_DESCENT_SONG_PLAYER.setCycleCount(1);
        ResourceUtils.EVENT_BLOCK_DESCENT_SONG_PLAYER.play();

        setTimeout(
          () => {
            ResourceUtils.EVENT_BLOCK_DESCENT_SONG_PLAYER.stop();;
          },
          ResourceUtils.EVENT_BLOCK_DESCENT_SONG.getDuration().toMillis() // wait for song duration
        );
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
        return ResourceUtils.PLAYER_DEATH_SONG.getDuration().toMillis();
      case ESongType.PLAYER_DAMAGE:
        return ResourceUtils.PLAYER_DAMAGE_SONG.getDuration().toMillis();
      case ESongType.LEVEL_COMPLETE:
        return ResourceUtils.LEVEL_COMPLETE_SONG_.getDuration().toMillis();
      default:
        return 0;
    }
  }

  /**
   * stop song
   */
  public static stopSong(): void {
    ResourceUtils.OUT_OF_LEVEL_MENU_SONG_PLAYER.stop();
    ResourceUtils.LEVEL_SONG_PLAYER.stop();
    ResourceUtils.PLAYER_DEATH_SONG_PLAYER.stop();
    ResourceUtils.LEVEL_COMPLETION_SONG_PLAYER.stop();
    ResourceUtils.PLAYER_ACTION_SONG_PLAYER.stop();
    ResourceUtils.EVENT_BLOCK_DESCENT_SONG_PLAYER.stop();
  }

  private constructor() {}
}