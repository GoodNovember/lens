import { hookupSpringPhysics } from './engine.js'
import { makeLine } from '../Utilities/makeLine.js'
export const makeSpring = ({
  pointA,
  pointB,
  friction,
  stiffness = 0.2,
  length,
  hidden
}) => {
  const line = makeLine({ pointA, pointB, hidden })

  const recalculate = () => {
    // const drawPointA = new Point(pointA.x, pointA.y)
    // const drawPointB = new Point(pointB.x, pointB.y)
    // line.geometry.points = [pointA.point, pointB.point]
  }

  const output = {
    line,
    pointA,
    pointB,
    friction,
    stiffness,
    length,
    hidden,
    recalculate
  }

  hookupSpringPhysics(output)

  return output
}