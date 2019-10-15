import { makeCircle } from '../Utilities/makeCircle.js'
import { PIXI } from '../Utilities/localPIXI.js'

import { registerJackOnNetwork } from '../Utilities/universalJackConnectionNetwork.js'

const {
  display
} = PIXI

const {
  Stage
} = display

export const makeJack = ({ name, tint = 0xffffffff, kind, x, y }) => {
  console.log({ jack: { name, tint, kind, x, y } })
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
  const getGlobalBounds = () => {
    const { x, y } = container.getGlobalPosition()
    return {
      x, y
    }
  }

  const moveTo = (x, y) => {
    container.x = x
    container.y = y
  }

  const outputJack = {
    get x() {
      return container.x
    },
    set x(newX) {
      container.x = newX
    },
    get y() {
      return container.y
    },
    set y(newY) {
      container.y = newY
    },
    moveTo,
    getGlobalBounds,
    name,
    circle,
    container,
    kind
  }

  registerJackOnNetwork({ jack: outputJack })

  return outputJack
}
