// import { Sprite, Texture } from 'pixi.js'
import {PIXI} from './localPIXI.js'
const { Sprite, Texture:{ WHITE } } = PIXI

export const makeRect = ({
  x,
  y,
  tint,
  width,
  height,
  cursor,
  interactive,
  texture = WHITE
}) => {
  const rect = new Sprite(texture)
  rect.x = x
  rect.y = y
  rect.tint = (tint) || (0xFFFFFF)
  rect.width = width
  rect.height = height
  rect.cursor = (cursor) || (rect.cursor)
  rect.interactive = !!(interactive)
  return rect
}
