import { makeCircle } from '../Utilities/makeCircle.js'
import { PIXI } from '../Utilities/localPIXI.js'

import { registerJackOnNetwork } from '../Utilities/universalJackConnectionNetwork.js'

const {
  display
} = PIXI

const {
  Stage
} = display

export const makeJack = ({ name, universe, tint = 0xffffffff, kind, x, y }) => {
  const container = new Stage()
  const circle = makeCircle({
    radius: 8,
    innerRadius: 4,
    borderThickness: 1,
    x: 0,
    y: 0
  })
  circle.tint = tint
  container.x = x
  container.y = y
  container.addChild(circle)

  return {
    get x() {
      return container.toGlobal(universe.wireLayer.position).x - universe.wireLayer.x * 2
    },
    get y() {
      return container.toGlobal(universe.wireLayer.position).y - universe.wireLayer.y * 2
    },
    name,
    get tint() {
      return circle.tint
    },
    set tint(tintValue) {
      circle.tint = tintValue
    },
    container,
    kind
  }

  registerJackOnNetwork({ jack: outputJack })

  return outputJack
}
