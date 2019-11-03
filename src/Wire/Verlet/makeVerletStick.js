import { PIXI } from '../Utilities/localPIXI.js'

import { hookupStickPhysics } from './engine.js'

const {
  SimpleRope,
  Texture,
  Point
} = PIXI

const makeLine = ({
  pointA,
  pointB
}) => {
  const drawPointA = new Point(pointA.x, pointA.y)
  const drawPointB = new Point(pointB.x, pointB.y)
  const line = new SimpleRope(Texture.WHITE, [drawPointA, drawPointB])
  line.interactive = true
  return line
}

export const makeVerletStick = ({ pointA, pointB, length }) => {
  const line = makeLine({ pointA, pointB })

  const recalculate = () => {
    const drawPointA = new Point(pointA.x, pointA.y)
    const drawPointB = new Point(pointB.x, pointB.y)
    line.geometry.points = [drawPointA, drawPointB]
  }

  const output = {
    line,
    pointA,
    pointB,
    recalculate,
    length
  }

  hookupStickPhysics(output)

  return output
}