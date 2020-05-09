import { ABlock } from "./block.abstract";
import { constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { ResourceUtils } from "../../utils/resource-utils";
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { ESongType } from "../../enums/song-type.enum";

/**
 * Block;
 * invisible block only has bottom boundary active
 */
export class Block extends ABlock {

  // true means breakable from bottom
  readonly isBreakableFromBottom: boolean;

  /**
   * set properties of this;
   * sets this to affect all characters and be visible
   */
  // constructor(leftX: number,
  //             topY: number,
  //             width: number,
  //             height: number,
  //             blockLineThickness: number,
  //             isBreakableFromBottom: boolean,
  //             isActive: boolean) {

  //   super(leftX, topY, width, height, blockLineThickness, false); // initially not active, to be set in makeActive()

  //   if (isBreakableFromBottom) {
  //     this.fillColor = constants.BREAKABLE_BLOCK_COLOR;
  //   } else {
  //     this.fillColor = constants.DEFAULT_BLOCK_COLOR;
  //   }
  //   this.isBreakableFromBottom = isBreakableFromBottom;

  //   this.topSide = new HorizontalBoundary(
  //     leftX,
  //     topY,
  //     width,
  //     blockLineThickness,
  //     true,
  //     false // initially not active, to be set in makeActive()
  //   );

  //   if (isActive) {
  //     this.makeActive();
  //   }
  // }

  /**
   * set properties of this;
   * sets this to be active for all characters;
   * if given isVisible is false, only bottom boundary of block is active
   * to all characters
   */
  constructor(leftX: number,
              topY: number,
              width: number,
              height: number,
              blockLineThickness: number,
              isVisible: boolean,
              isBreakableFromBottom: boolean,
              isActive: boolean) {

    super(leftX, topY, width, height, blockLineThickness,
      isVisible, false); // initially not active, to be set in makeActive()

    if (isBreakableFromBottom) {
      this.fillColor = constants.BREAKABLE_BLOCK_COLOR;
    } else {
      this.fillColor = constants.DEFAULT_BLOCK_COLOR;
    }
    this.isBreakableFromBottom = isBreakableFromBottom;

    this.topSide = new HorizontalBoundary(
      leftX,
      topY,
      width,
      blockLineThickness,
      isVisible,
      true,
      true,
      true,
      false // initially not active, to be set in makeActive()
    );

    if (isActive) {
      this.makeActive();
    }
  }

  /**
   * runs continuously
   */
  public draw(): void {
    if (this.isVisible) {
      this.show();
    }

    const player = platformer.getCurrentActivePlayer();
    // handle player collision with invisible block
    if (player != null && this.bottomSide.contactWithCharacter(player)) {
      if (!this.isVisible) {
        this.handleInvisibleBlockCollisionWithPlayer();

      } else if (this.isBreakableFromBottom) {
        this.removeBlockFromPlayerContact();
      }
    }
  }


  /**
   * active and add this to game
   */
  makeActive(): void {
    platformer.addToAllDrawables(this); // connect this draw() from main draw()

    // make horizontal boundaries first since their detection takes precedence
    this.bottomSide.makeActive();

    if (this.isVisible) {
      this.topSide.makeActive();
      this.leftSide.makeActive();
      this.rightSide.makeActive();
    }
  }

  /**
   * deactivate and remove this from game
   */
  public makeNotActive(): void {
    this.topSide.makeNotActive();
    this.bottomSide.makeNotActive();
    this.leftSide.makeNotActive();
    this.rightSide.makeNotActive();

    platformer.deleteFromAllDrawables(this); // disconnect this draw() from main draw()
  }

  /**
   * handle invisible block player contact
   */
  handleInvisibleBlockCollisionWithPlayer(): void {
    if (this.isBreakableFromBottom) {
      this.removeBlockFromPlayerContact();

    } else {
      this.isVisible = true;
      this.topSide.makeActive();
      this.topSide.setVisible(true);

      this.bottomSide.setVisible(true);

      this.leftSide.makeActive();
      this.leftSide.setVisible(true);

      this.rightSide.makeActive();
      this.rightSide.setVisible(true);
    }
  }

  /**
   * remove block from player contact
   */
  removeBlockFromPlayerContact(): void {
    platformer.getCurrentActivePlayer().handleContactWithHorizontalBoundary(
      this.bottomSide.getStartPoint().y,
      false);
    ResourceUtils.playSong(ESongType.PLAYER_ACTION);
    this.makeNotActive();
    platformer.getCurrentActiveLevelDrawableCollection().removeDrawable(this);
  }
}