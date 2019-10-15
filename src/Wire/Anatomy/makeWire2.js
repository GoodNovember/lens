import { PIXI } from '../Utilities/localPIXI.js'

const {
  display,
  Graphics,
  SimpleRope,
  Texture,
  Point
} = PIXI

const {
  Stage
} = display

export const makeWire = ({ jackA, jackB }) => {
  const container = new Stage()
  const prettyGraphics = new Graphics()

  const calculatePoints = () => {
    const startPoint = new Point(jackA.x, jackA.y)
    const endPoint = new Point(jackB.x, jackB.y)

    return [
      startPoint,
      endPoint
    ]
  }

  const pointArray = calculatePoints()

  const rope = new SimpleRope(Texture.WHITE, pointArray)
  rope.interactive = true

  const updatePoints = () => {
    const newPoints = calculatePoints()
    rope.geometry.points = newPoints
  }

  const draw = () => {
    updatePoints()
  }

  prettyGraphics.tint = jackA.tint

  draw()

  jackA.container.on('parent move', () => {
    // console.log('Jack A Moved!', jackA.x, jackA.y)
    draw()
  })

  jackB.container.on('parent move', () => {
    // console.log('Jack B Moved')
    draw()
  })

  console.log('Making Wire', { jackA, jackB, prettyGraphics })

  // container.addChild(prettyGraphics)

  container.addChild(rope)

  return {
    container
  }
}
