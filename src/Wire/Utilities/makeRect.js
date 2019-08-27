import { PIXI } from './localPixi.js'

const { Sprite, Texture } = PIXI
const { WHITE } = Texture

export const makeRect = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0
}) => {
  const rect = new Sprite(WHITE)
  rect.width = width
  rect.height = height
  rect.x = x
  rect.y = y
  return rect
}
