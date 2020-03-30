import * as p5 from 'p5';
import { CONSTANTS } from './const/constants';

function setup() {
  createCanvas(CONSTANTS.SCREEN_WIDTH, CONSTANTS.SCREEN_HEIGHT);
}

function draw() {
  ellipse(50, 50, 80, 80);
}
