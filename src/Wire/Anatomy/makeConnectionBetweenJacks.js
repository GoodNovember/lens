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

export const makeConnectionBetweenJacks = ({ jackA, jackB }) => {
  const container = new Stage()

  const calculatePoints = () => {
    const startPoint = new Point(jackA.x, jackA.y)
    const endPoint = new Point(jackB.x, jackB.y)

    return [
      startPoint,
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
    console.log('Disconnecting wire', { jackA, jackB, universe, })
    if (typeof disconnector === 'function') {
      disconnector()
    }
  }
}
