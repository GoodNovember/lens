import { PIXI } from '../Utilities/localPIXI.js'

import { hookupStickPhysics } from './engine.js'

const {
  SimpleRope,
  Texture,
  Point,
  Container
} = PIXI

const makeLine = ({
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