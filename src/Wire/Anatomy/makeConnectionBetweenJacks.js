import { PIXI } from '../Utilities/localPIXI.js'

const {
  display,
  SimpleRope,
  Texture,
  Point
} = PIXI

const {
  Stage
} = display

const getMidPoint = ({ pointA, pointB }) => {
  const midX = (pointB.x + pointA.x) / 2
  const midY = (pointB.y + pointA.x) / 2
  return new Point(midX, midY)
}

export const makeConnectionBetweenJacks = ({ jackA, jackB }) => {
  const container = new Stage()

  const classifyJackPositions = () => {
    let left = null
    let right = null
    let top = null
    let bottom = null
    let sameY = false
    let sameX = false
    if (jackA.x < jackB.x) {
      left = jackA
      right = jackB
    } else if (jackA.x === jackB.x) {
      sameX = true
    } else {
      left = jackB
      right = jackA
    }
    if (jackA.y < jackB.y) {
      top = jackA
      bottom = jackB
    } else if (jackA.y === jackB.y) {
      sameY = true
    } else {
      top = jackB
      bottom = jackA
    }
    return {
      left,
      right,
      top,
      bottom,
      sameY,
      sameX
    }
  }

  const calculatePoints = () => {
    const pointCount = 10

    // const classified = classifyJackPositions()

    // console.log(classified)

    const startPoint = new Point(jackA.x, jackA.y)
    const endPoint = new Point(jackB.x, jackB.y)

    const middlePoints = [
      new Point(jackA.x, ((jackA.y + jackB.y) / 2) - (jackA.x - jackB.x) / 2),
      // new Point(jackA.x, ((jackA.y + jackB.y) / 2)),
      // new Point(jackB.x, ((jackA.y + jackB.y) / 2)),
      new Point(jackB.x, ((jackA.y + jackB.y) / 2) + (jackA.x - jackB.x) / 2)
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
    console.log('Disconnecting wire', { jackA, jackB, universe })
    if (typeof disconnector === 'function') {
      disconnector()
    }
  }
}
