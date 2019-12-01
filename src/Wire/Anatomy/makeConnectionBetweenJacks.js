import { PIXI } from '../Utilities/localPIXI.js'

import { getMidPoint } from '../Utilities/getMidPoint.js'

const {
  display,
  SimpleRope,
  Texture,
  Point
} = PIXI

const {
  Stage
} = display

export const makeConnectionBetweenJacks = ({ jackA, jackB }) => {
  const container = new Stage()

  // const classifyJackPositions = () => {
  //   let left = null
  //   let right = null
  //   let top = null
  //   let bottom = null
  //   let sameY = false
  //   let sameX = false
  //   if (jackA.x < jackB.x) {
  //     left = jackA
  //     right = jackB
  //   } else if (jackA.x === jackB.x) {
  //     sameX = true
  //   } else {
  //     left = jackB
  //     right = jackA
  //   }
  //   if (jackA.y < jackB.y) {
  //     top = jackA
  //     bottom = jackB
  //   } else if (jackA.y === jackB.y) {
  //     sameY = true
  //   } else {
  //     top = jackB
  //     bottom = jackA
  //   }
  //   return {
  //     left,
  //     right,
  //     top,
  //     bottom,
  //     sameY,
  //     sameX
  //   }
  // }

  const calculatePoints = () => {
    const startPoint = new Point(jackA.x, jackA.y)
    const endPoint = new Point(jackB.x, jackB.y)
    const midPoint = getMidPoint({ pointA: jackA, pointB: jackB })

    const middlePoints = [
      midPoint
    ]

    return [
      startPoint,
      ...middlePoints,
      endPoint
    ]
  }

  const ropePointArray = calculatePoints()
  const rope = new SimpleRope(Texture.WHITE, ropePointArray)
  rope.interactive = true

  const calculateRopeFromJackLocations = () => {
    const newPoints = calculatePoints()
    rope.geometry.points = newPoints
  }

  calculateRopeFromJackLocations()

  jackA.container.on('parent move', () => {
    calculateRopeFromJackLocations()
  })

  jackB.container.on('parent move', () => {
    calculateRopeFromJackLocations()
  })

  console.log('Making Wire', { jackA, jackB })

  container.addChild(rope)

  let disconnector = () => { }

  if (jackA.universe === jackB.universe) {
    console.log('Same Universe Jacks Connected')
    jackA.universe.wireLayer.addChild(container)
    disconnector = () => { jackA.universe.wireLayer.removeChild(container) }
  } else {
    console.log('Different Universe Jacks Connected')
    console.error('not Implemented.')
  }
  return () => {
    console.log('Disconnecting wire', { jackA, jackB })
    if (typeof disconnector === 'function') {
      disconnector()
    }
  }
}
