import { PIXI } from '../Utilities/localPIXI.js'

const {
  display,
  Graphics
} = PIXI

const {
  Stage
} = display

export const makeWire = ({ jackA, jackB }) => {
  const container = new Stage()
  const prettyGraphics = new Graphics()

  const draw = () => {
    prettyGraphics.clear()
    prettyGraphics.zIndex = 1000
    prettyGraphics.lineStyle(6, 0xffffff, 1, 0.5, false)
    prettyGraphics.moveTo(jackA.x, jackA.y)
    prettyGraphics.lineTo(jackB.x, jackB.y)
  }

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

  container.addChild(prettyGraphics)

  return {
    container
  }
}
