import * as p5 from 'p5';
import { CONSTANTS } from './const/constants';

const sketch = (s: p5): void => {

  s.preload = () => {
    // preload code
  }

  s.setup = () => {
    s.createCanvas(CONSTANTS.SCREEN_WIDTH, CONSTANTS.SCREEN_HEIGHT);
  };

  s.draw = () => {
    s.fill(s.color(CONSTANTS.ENEMY_COLOR));
    s.ellipse(CONSTANTS.ELLIPSE, CONSTANTS.ELLIPSE, CONSTANTS.ELLIPSE, CONSTANTS.ELLIPSE);
  };
}

new p5(sketch);
