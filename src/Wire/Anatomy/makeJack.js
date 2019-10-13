import { makeCircle } from '../Utilities/makeCircle.js'
import { PIXI } from '../Utilities/localPIXI.js'

const {
  display
} = PIXI

const {
  Stage
} = display

export const makeJack = ({ name, tint = 0xffffffff, kind, x, y }) => {
  const container = new Stage()
  const circle = makeCircle({ 
    radius:8, 
    innerRadius:4,
    borderThickness: 1,
    x:0, 
    y:0
  })
  circle.tint = tint
  container.x = x
  container.y = y
  container.addChild(circle)
  return {
    name,
    container,
    kind
  }
}
