import { makeCircle } from '../Utilities/makeCircle.js'
import { PIXI } from '../Utilities/localPIXI.js'

import { registerJackOnNetwork } from '../Utilities/universalJackConnectionNetwork.js'
import { makeConnectionBetweenJacks } from './makeConnectionBetweenJacks.js'

const { display } = PIXI

const { Stage } = display

export const makeJack = ({
  name,
  universe,
  tint = 0xffffffff,
  kind,
  connectionValidator = () => true, // we trust, for now.
  x,
  y
}) => {
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

  const selfJack = {
    get x() { // surely the real math is much prettier.
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
    circle,
    receiveConnectionRequest,
    connectTo,
    container,
    universe,
    kind
  }

  function receiveConnectionRequest({ jack, ...others }) {
    return new Promise((resolve, reject) => {
      if (typeof connectionValidator === 'function') {
        let result = null
        try {
          result = connectionValidator({ jack, selfJack, ...others })
        } catch (error) {
          reject(error)
        }
        resolve(!!result)
      } else {
        console.error('Hey man, I was looking for a callback function, would you mind sending one of those instead of this:', { connectionValidator })
      }
    })
  }

  function connectTo({ jack }) {
    let isAlive = true
    let disconnect = () => { }
    jack.receiveConnectionRequest({ jack: selfJack }).then((isSuccessful) => {
      if (isAlive === true) {
        if (isSuccessful) {
          disconnect = makeConnectionBetweenJacks({ jackA: selfJack, jackB: jack, universe })
        } else {
          console.error('Jack Connection Request Denied.', selfJack, jack)
        }
      }
    }).catch(error => {
      console.error('Jack Connection Request Error.', error)
    })
    return () => {
      isAlive = false
      if (disconnect === 'function') {
        disconnect()
      }
    }
  }

  registerJackOnNetwork({ jack: selfJack })

  return selfJack
}
