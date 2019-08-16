import { Sprite, Texture } from 'pixi.js'

const { WHITE } = Texture

export const makeRect = ({
  x,
  y,
  tint,
  width,
  height,
  cursor,
  interactive
}) => {
  const rect = new Sprite(WHITE)
  rect.x = x
  rect.y = y
  rect.tint = (tint) || (0xFFFFFF)
  rect.width = width
  rect.height = height
  rect.cursor = (cursor) || (rect.cursor)
  rect.interactive = !!(interactive)
  return rect
}
