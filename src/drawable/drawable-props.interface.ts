/**
 * properties common for drawable constructors
 */
export interface IDrawableProps {
  // impl: set to true if not provided;
  // set to false for drawables that should not initially be in draw() loop 
  // (ie.get activated by a trigger boundary)
  initAsActive?: boolean;
}