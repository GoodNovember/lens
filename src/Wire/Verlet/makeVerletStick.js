import { PIXI } from '../Utilities/localPIXI.js'

import { hookupStickPhysics } from './engine.js'

import { makeLine } from '../Utilities/makeLine.js'

const {
  SimpleRope,
  Texture,
  Point,
  Container
} = PIXI

export const makeVerletStick = ({ pointA, pointB, length, hidden = false }) => {
  const line = makeLine({ pointA, pointB, hidden })

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