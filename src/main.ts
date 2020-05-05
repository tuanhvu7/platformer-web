import p5 from 'p5';
import { platformer } from './platformer';
// https://stackoverflow.com/questions/45921431/fetch-external-audio-file-into-web-audio-api-buffer-cors-error
// https://stackoverflow.com/questions/56199144/how-to-use-p5-sound-in-typescript-node-js
// https://github.com/processing/p5.js-sound/issues/137

export const mainSketch = new p5(platformer.sketch);