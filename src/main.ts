import p5 from 'p5';
import { platformer } from './platformer';

console.log('*** in main.ts');
export const mainSketch = new p5(platformer.sketch);