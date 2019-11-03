import { PIXI } from './localPIXI.js'

const {
  Point
} = PIXI

export const getMidPoint = ({ pointA, pointB }) => {
  const newX = (pointA.x + pointB.x) / 2
  const newY = (pointA.y + pointB.y) / 2
  return new Point(newX, newY)
}
