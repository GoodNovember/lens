import { PIXI } from '../Utilities/localPIXI.js'

import { getMidPoint } from '../Utilities/getMidPoint.js'

import { getTextures } from '../Theme/imperfection/theme.js'

const {
  SimpleRope,
  Point
} = PIXI

export const makeConnectionBetweenJackAndPointer = async ({ jack, event }) => {
  const { wireLayer } = jack.universe

  console.log({ event, jack })

  const textures = await getTextures()

  const calculatePoints = ({ event }) => {
    const startPoint = new Point(jack.centerX, jack.centerY)
    const endPoint = event.data.getLocalPosition(wireLayer)
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

  const ropePointArray = calculatePoints({ event })

  const rope = new SimpleRope(textures.rope.texture, ropePointArray)
  rope.interactive = true

  wireLayer.addChild(rope)

  const disconnect = () => {
    wireLayer.removeChild(rope)
  }

  const mouseMove = ({ event }) => {
    const points = calculatePoints({ event })
    rope.geometry.points = points
  }

  return {
    disconnect,
    mouseMove
  }
}
