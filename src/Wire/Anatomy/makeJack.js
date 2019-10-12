import { makeRect } from '../Utilities/makeRect.js'
import { makeCircle } from '../Utilities/makeCircle.js'
import { PIXI } from '../Utilities/localPIXI.js'
import * as cursors from '../Misc/cursors.js'
import { Circle } from 'pixi.js'

const {
  display,
  Graphics
} = PIXI

const {
  Layer,
  Stage
} = display

export const makeJack = ({ name, tint = 0xffffffff, kind, x, y }) => {
  const container = new Stage()
  const circle = makeCircle({ radius:8, innerRadius:6, x, y })
  circle.tint = tint
  container.x = x
  container.y = y
  container.addChild(circle)
  return {
    container,
    kind
  }
}
