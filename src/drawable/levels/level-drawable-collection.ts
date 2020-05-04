import { IDrawable } from '../drawable.interface';
import { ACharacter } from '../characters/character.abstract';
import { ABoundary } from '../boundaries/boundary.abstract';
import { ABlock } from '../blocks/block.abstract';
import { ACollectable } from '../collectables/collectable.abstract';

/**
 * For storing and managing drawables in levels
 */
export class LevelDrawableCollection {
  // set of all non-playable characters
  private readonly charactersList: Set <ACharacter>;

  // set of all boundaries
  private readonly boundariesList: Set <ABoundary>;

  // set of all blocks
  private readonly blocksList: Set <ABlock>;

  // set of all collectables
  private readonly collectablesList: Set <ACollectable>;

  /**
   * sets properties of this
   */
  constructor() {
    this.charactersList = new Set();
    this.boundariesList = new Set();
    this.blocksList = new Set();
    this.collectablesList = new Set();
  }

  /**
   * remove given drawable from appropriate set
   */
  public removeDrawable(drawable: IDrawable): void {
    if (drawable instanceof ACharacter) {
      this.charactersList.delete(drawable);

    } else if (drawable instanceof ABoundary) {
      this.boundariesList.delete(drawable);

    } else if (drawable instanceof ABlock) {
      this.blocksList.delete(drawable);

    } else if (drawable instanceof ACollectable) {
      this.collectablesList.delete(drawable);
    }
  }

  /**
   * add given drawable to correct set
   */
  addDrawable(drawable: IDrawable): void {
    if (drawable instanceof ACharacter) {
      this.charactersList.add(<ACharacter> drawable);

    } else if (drawable instanceof ABoundary) {
      this.boundariesList.add(<ABoundary> drawable);

    } else if (drawable instanceof ABlock) {
      this.blocksList.add(<ABlock> drawable);

    } else if (drawable instanceof ACollectable) {
      this.collectablesList.add(<ACollectable> drawable);
    }
  }

  /**
   * make all drawables not active and clears all sets
   */
  deactivateClearAllDrawable(): void {
    this.charactersList.forEach((curCharacter: ACharacter) => {
      curCharacter.makeNotActive();
    });

    this.boundariesList.forEach((curBoundary: ABoundary) => {
      curBoundary.makeNotActive();
    });

    this.blocksList.forEach((curBlock: ABlock) => {
      curBlock.makeNotActive();
    });

    this.collectablesList.forEach((curCollectable: ACollectable) => {
      curCollectable.makeNotActive();
    });

    this.charactersList.clear();
    this.boundariesList.clear();
    this.blocksList.clear();
    this.collectablesList.clear();
  }

  public getCharactersList(): Set <ACharacter> {
    return this.charactersList;
  }
}
