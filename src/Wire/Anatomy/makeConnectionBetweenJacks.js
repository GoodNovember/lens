import { PIXI } from '../Utilities/localPIXI.js'

import { getMidPoint } from '../Utilities/getMidPoint.js'

import { getTextures } from '../Theme/imperfection/theme.js'

const {
  display,
  SimpleRope,
  Texture,
  Point
} = PIXI

const {
  Stage
} = display

export const makeConnectionBetweenJacks = async ({ jackA, jackB }) => {
  const container = new Stage()

  const calculatePoints = () => {
    const startPoint = new Point(jackA.centerX, jackA.centerY)
    const endPoint = new Point(jackB.centerX, jackB.centerY)
    const midPoint = getMidPoint({ pointA: startPoint, pointB: endPoint })

    const middlePoints = [
      midPoint
    ]

    return [
      startPoint,
      ...middlePoints,
      endPoint
    ]
  }

  const textures = await getTextures()

  const ropePointArray = calculatePoints()
  const rope = new SimpleRope(textures.rope.texture, ropePointArray)
  rope.interactive = true

  const calculateRopeFromJackLocations = () => {
    const newPoints = calculatePoints()
    rope.geometry.points = newPoints
  }

  calculateRopeFromJackLocations()

  jackA.container.on('parent move', () => {
    calculateRopeFromJackLocations()
  })

  jackA.container.on('parent resize', () => {
    calculateRopeFromJackLocations()
  })

  jackB.container.on('parent move', () => {
    calculateRopeFromJackLocations()
  })

  jackB.container.on('parent resize', () => {
    calculateRopeFromJackLocations()
  })

  // console.log('Making Wire', { jackA, jackB })

  rope.on('pointerdown', () => {
    rope.on('pointerup', () => {
      jackA.eject(jackB)
      // console.log('Disconnecting wire', { jackA, jackB })
      if (typeof disconnector === 'function') {
        disconnector()
      }
    })
  })

  container.addChild(rope)

  let disconnector = () => { }

  if (jackA.universe === jackB.universe) {
    // console.log('Same Universe Jacks Connected')
    jackA.universe.wireLayer.addChild(container)
    disconnector = () => { jackA.universe.wireLayer.removeChild(container) }
  } else {
    console.log('Different Universe Jacks Want To Connect.')
    console.error('not Implemented.')
  }
  return () => {
    // console.log('Disconnecting wire', { jackA, jackB })
    if (typeof disconnector === 'function') {
      disconnector()
    }
  }
}
