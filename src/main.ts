import * as p5 from 'p5';
import { MockMenu } from './drawable/menus/mock-menu';
import { platformer } from './platformer';

platformer.drawable.push(new MockMenu());
export const mainSketch = new p5(platformer.sketch);
