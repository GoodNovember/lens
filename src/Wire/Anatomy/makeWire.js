
// This file is actually dumb.

import { PIXI } from '../Utilities/localPIXI.js'

const {
  Point,
  Texture: { WHITE },
  Graphics,
  SimpleRope,
  LineStyle
} = PIXI

import { getRootWireLayer } from '../Utilities/universalJackConnectionNetwork.js'

const wireRootLayer = getRootWireLayer({})

const wireStyle = new LineStyle()
wireStyle.color = 0xffffffff
wireStyle.width = 8

export const makeWire = ({ jackA, jackB }) => {
  const { x: jackAX, y: jackAY } = jackA.getGlobalBounds()
  const { x: jackBX, y: jackBY } = jackB.getGlobalBounds()

  const makePathOfPoints = () => {
    const startPoint = new Point(jackAX, jackAY)
    const endPoint = new Point(jackBX, jackBY)
    return [
      startPoint,
      endPoint
    ]
  }

  const connect = () => {
    const pointsArray = makePathOfPoints()
    const graphics = new Graphics()
    console.log('a Line between', { jackAX, jackAY, jackBX, jackBY })
    graphics.clear()
    graphics.lineStyle(4, 0xffffff, 1.0, 0.5, false)
    graphics.moveTo(jackAX - 10, jackAY - 10)
    graphics.lineTo(jackBX, jackBY)

    wireRootLayer.addChild(graphics)
  }

  connect()

  const reconnect = () => {
    connect()
  }

  // jackA.on('parent move', () => {
  //   reconnect()
  // })

  // jackB.on('parent move', () => {
  //   reconnect()
  // })

  const disconnect = () => {

  }

  return {
    disconnect
  }
}