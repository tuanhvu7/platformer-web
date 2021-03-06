import { Block } from "./block";
import { platformer } from '../../platformer';
import { mainSketch } from '../../main';
import { constants } from "../../const/constants";
import { ACollectable } from "../collectables/collectable.abstract";
import { IItemBlockProps } from './block-prop.interfaces';

/**
 * Block with item that appears when hit from below by player
 */
export class ItemBlock extends Block {

  // item to appear when this is hit from below by player;
  // this overrides item position to be above this and item to be not active
  private readonly item: ACollectable;

  private itemAppeared: boolean;

  private blockText: String;

  /**
   * set properties of this;
   * if given isVisible is false, only bottom boundary of block is active
   * to all characters
   */
  constructor(iteemBlockProps: IItemBlockProps) {
    super(iteemBlockProps);

    this.blockText = "?";
    this.itemAppeared = false;

    this.item = iteemBlockProps.item;
    this.item.makeNotActive();
    this.item.setLeftX((this.leftX + this.width / 2) - this.item.getWidth() / 2);
    this.item.setTopY(this.topY - this.item.getHeight());
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

      if (!this.itemAppeared) {
        this.item.makeActive();
        this.itemAppeared = true;
        this.blockText = "''";
      }

      if (!this.isVisible) {
        this.handleInvisibleBlockCollisionWithPlayer();

      } else if (this.isBreakableFromBottom) {
        this.removeBlockFromPlayerContact();
      }
    }
  }

  show(): void {
    mainSketch.fill(this.fillColor);
    mainSketch.rect(this.leftX, this.topY, this.width, this.height);

    mainSketch.fill(constants.ITEM_BLOCK_TEXT_COLOR);
    mainSketch.textAlign(mainSketch.CENTER, mainSketch.CENTER);
    mainSketch.textSize(Math.min(this.width / 2, this.height / 2));
    mainSketch.text(
      this.blockText,
      this.leftX, this.topY,
      this.width, this.height);
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
}
