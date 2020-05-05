import { ResourceUtils } from '../../utils/resource-utils';
import { mainSketch } from '../../main';
import { IDrawable } from '../drawable.interface';
import { platformer } from '../../platformer';
import { IKeyControllable } from '../key-controllable.interface';
import { IMouseControllable } from '../mouse-controllable.interface';
import { EMock } from './mock-enum';

export class MockMenu implements IDrawable, IKeyControllable, IMouseControllable {

  private background: any;
  constructor() {
    this.background = ResourceUtils.DEFAULT_MENU_IMAGE;
    platformer.addToAllDrawables(this);
    platformer.addToAllKeyControllables(this);
    platformer.addToAllMouseControllables(this);
  }

  /**
   * runs continuously; draws background of this
   */
  public draw(): void {
    mainSketch.background(this.background);
  }

  /**
   * runs continuously; draws background of this
   */
  public keyPressed(): void {
    // ArrowUp -> & 38
    // ArrowDown -> ( 40
    // ArrowLeft -> % 37
    // ArrowRight -> ' 39

    console.log(mainSketch.key);
    console.log(mainSketch.keyCode);
    console.log(String.fromCharCode(mainSketch.keyCode), String.fromCharCode(mainSketch.keyCode).toLowerCase());
    console.log(String.fromCharCode(mainSketch.keyCode).toLowerCase() == '%');
    this.background = 'red';
    setTimeout(
      () => {
        this.background = ResourceUtils.DEFAULT_MENU_IMAGE;
      },
      5000
    );
  }

  public mouseClicked(event: MouseEvent): void {
    console.log(event.x, event.y);
    console.log('mouseClicked', EMock.FOO, EMock.BAR, EMock.BAZ);
    for (const curMock in EMock) {
      console.log('curMock', curMock);
      console.log('EMock[curMock] as any', EMock[curMock] as any); // use this
      this.enumTest(EMock[curMock] as any);
      console.log('*******');
    }
    // platformer.deleteFromAllDrawables(this);
    // platformer.deleteFromAllKeyControllables(this);
    // platformer.deleteFromAllMouseControllables(this);
  }

  private enumTest(mockEnum: EMock): void {
    switch (mockEnum) {
      case EMock.FOO:
        // this prints when; curMock = FOO & EMock[curMock] as any = 0
        console.log('FOO', mockEnum);
        break;
      case EMock.BAR:
        console.log('BAR',mockEnum);
        break;
      case EMock.BAZ:
        console.log('BAZ',mockEnum);
        break;
      default:
        break;
    }
  }
}
