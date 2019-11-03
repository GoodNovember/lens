// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'
import { makeToolbox } from './Parts/makeToolbox.js'

import { makeVerletPoint } from '../Wire/Verlet/makeVerletPoint.js'
import { makeVerletStick } from '../Wire/Verlet/makeVerletStick.js'
import { distanceBetweenPoints } from '../Wire/Verlet/utilities.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  //parable: 
  //  A stick requires two points and a length
  //  A point requires a horizontal location (x) and a vertical location (y)
  //    The locations can be anywhere between Negative infinity and positive infinity.
  //      ... -Infinity < location > Infinity
  //      ... -9999999999999(...) < location > 9999999999999(...)
  //      ... zero is the middle, but there is no middle in the concept of universes.
  //      ... middle is a concept aggred upon, and an agreement requires at least two parties.
  //      ... a stick has a middle, because it is an agreement between two points.

  const globalLeftOffset = 200
  const globalTopOffset = -500

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  const makeSimpleStick = ({ pointA, pointB, ...rest }) => {
    const length = distanceBetweenPoints({ pointA, pointB })
    const stick = makeVerletStick({ pointA, pointB, length, ...rest })
    return stick
  }

  const verletPointA = makeVerletPoint({ x: worldX(590), y: worldY(-400), isPinned: true })
  const verletPointB = makeVerletPoint({ x: worldX(50), y: worldY(50), })
  const verletPointC = makeVerletPoint({ x: worldX(200), y: worldY(50) })
  const verletPointD = makeVerletPoint({ x: worldX(50), y: worldY(200) })
  const verletPointE = makeVerletPoint({ x: worldX(200), y: worldY(200) })

  const points = [
    verletPointA,
    verletPointB,
    verletPointC,
    verletPointD,
    verletPointE
  ]

  const longStick = makeSimpleStick({
    pointA: verletPointA,
    pointB: verletPointC
  })
  const verletStickBC = makeSimpleStick({
    pointA: verletPointB,
    pointB: verletPointC
  })
  const verletStickCE = makeSimpleStick({
    pointA: verletPointC,
    pointB: verletPointE,
  })
  const verletStickED = makeSimpleStick({
    pointA: verletPointE,
    pointB: verletPointD
  })
  const verletStickDB = makeSimpleStick({
    pointA: verletPointD,
    pointB: verletPointB
  })
  const centerBrace = makeSimpleStick({
    pointA: verletPointB,
    pointB: verletPointE,
    hidden: true
  })

  const sticks = [
    longStick,
    verletStickBC,
    verletStickCE,
    verletStickED,
    verletStickDB,
    centerBrace
  ]

  sticks.forEach(stick => {
    universe.addChild(stick.line)
  })

  points.forEach(point => {
    universe.addChild(point.circle)
  })

}
