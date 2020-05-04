/**
 * Required methods for classes with keyboard controls
 */
export interface IKeyControllable {
  keyPressed(): void;
  keyReleased?(): void;
}