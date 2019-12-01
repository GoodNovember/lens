import { makeVerletStick } from './makeVerletStick.js'
import { distanceBetweenPoints } from './utilities.js'

export const makeSimpleStick = ({ pointA, pointB, ...rest }) => {
  // this is a stick whose length is calculated from the initial positions
  // of the two points passed into it. otherwise it is identical to other
  // verletSticks.
  const length = distanceBetweenPoints({ pointA, pointB })
  return makeVerletStick({ pointA, pointB, length, ...rest })
}