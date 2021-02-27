import { ABlock } from "./block.abstract";
import { constants } from "../../const/constants";
import { platformer } from '../../platformer';
import { ResourceUtils } from "../../utils/resource-utils";
import { HorizontalBoundary } from "../boundaries/horizontal-boundary";
import { ESongType } from "../../enums/song-type.enum";
import { IBlockProps } from "./block-prop.interfaces";
import { handleDefaultValue } from "../../utils/common-utils";

/**
 * Block;
 * invisible block only has bottom boundary active
 */
export class Block extends ABlock {

  // true means breakable from bottom
  readonly isBreakableFromBottom: boolean;

  /**
   * set properties of this;
   * 
   * if given isVisible is false, only bottom boundary of block is active
   * to all characters;
   * 
   * if isBreakableFromBottom is not given, default to false
   */
  constructor(blockProps: IBlockProps) {
    super(blockProps);
    /** START default values if optional prop(s) not defined */
    this.isBreakableFromBottom = handleDefaultValue(blockProps.isBreakableFromBottom, false);
    const initAsActive = handleDefaultValue(blockProps.initAsActive, true);
    /** END default values if optional prop(s) not defined */
    
    if (this.isBreakableFromBottom) {
      this.fillColor = constants.BREAKABLE_BLOCK_COLOR;
    } else {
      this.fillColor = constants.DEFAULT_BLOCK_COLOR;
    }
    
    // pass initAsActive=false to constructor since need this and its boundaries active state to be synced
    this.topSide = new HorizontalBoundary({
      startXPoint: blockProps.leftX,
      startYPoint: blockProps.topY,
      x2Offset: blockProps.width,
      boundaryLineThickness: blockProps.blockLineThickness,
      isVisible: this.isVisible,
      doesAffectPlayer: true,
      doesAffectNonPlayers: true,
      isFloorBoundary: true,
      initAsActive: false
    });

    if (initAsActive) {
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
    if (player && this.bottomSide.contactWithCharacter(player)) {
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
    platformer.getCurrentActivePlayer()?.handleContactWithHorizontalBoundary(
      this.bottomSide.getStartPoint().y,
      false);
    ResourceUtils.playSong(ESongType.PLAYER_ACTION);
    this.makeNotActive();
    platformer.getCurrentActiveLevelDrawableCollection().removeDrawable(this);
  }
}