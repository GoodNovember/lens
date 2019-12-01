import { makeJack } from '../Anatomy/makeJack.js'
import { makeText } from '../Parts/makeText.js'
import { PIXI } from '../Utilities/localPIXI.js'

const { Container } = PIXI

export const makeWireText = async ({
  name = `[an unnamed wireText]`,
  x: initialX,
  y: initialY,
  universe,
  message: initialMessage = ""
}) => {

  const container = new Container()

  const textElement = makeText(initialMessage)
  container.x = initialX
  container.y = initialY

  container.addChild(textElement)
  textElement.x = 16

  const textChange = await makeJack({
    x: 0,
    y: 8,
    name: `[${name}]'s textChangeJack`,
    kind: 'input-string',
    connectionValidator({ jack, selfJack }) {
      if (jack.kind === 'output-string') {
        if (selfJack.connections.size === 0) {
          return true
        }
      }
      return false
    },
    universe,
  })

  textChange.container.on('broadcast', ({ jack, payload }) => {
    textElement.text = payload
  })

  container.addChild(textChange.container)

  return {
    container,
    textElement,
    jacks: {
      textChange
    }
  }

}