import { PIXI } from '../Utilities/localPIXI.js'

const {
  SimpleRope,
  Texture,
  Point
} = PIXI

export const makeLine = ({
  pointA,
  pointB,
  hidden = false,
}) => {
  const drawPointA = new Point(pointA.x, pointA.y)
  const drawPointB = new Point(pointB.x, pointB.y)
  const line = new SimpleRope(Texture.WHITE, [drawPointA, drawPointB])
  line.interactive = true
  if (hidden === true) {
    line.alpha = 0
    line.renderable = false
  }
  return line
}