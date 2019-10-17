import PIXI from '../Utilities/localPIXI.js'

const {
  Point
} = PIXI

const SpringStiffnessConstant = 1.0

const makeAtom = ({ x, y }) => {
  return {
    point: new Point(x, y)
  }
}

const Vector = ({ magnitude, direction })

const makeSpring = ({ pointA, pointB, springForceAB, springForceBA }) => {
  // ForceVectorBA = -ForceVectorAB
  // ForceVector = -SpringStiffnessConstant * (LengthOfSpring - EqualibriumLengthOfSpring) * DirectionBetweenAtoms
  // EqualibriumLengthOfSpring = "natural length of spring"
}


export const makeRope = ({ jackA, jackB }) = {

}