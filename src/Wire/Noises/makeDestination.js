import { makeJack } from '../Anatomy/makeJack.js'
import { PIXI } from '../Utilities/localPIXI.js'
import { connectorValidator } from './validators/connectorValidator.js'

const { Container } = PIXI
export const makeDestination = async ({
  x,
  y,
  name = `[unnamed destination]`,
  context,
  universe
}) => {
  const container = new Container()
  const { destination } = context

  container.x = x
  container.y = y

  const jackIngredients = [
    {
      x: 8,
      y: 8,
      name: `[${name}]'s connector jack`,
      themeImage: 'jackConnector',
      universe,
      kind: 'connector',
      get node() {
        return destination
      },
      onConnect({ jack, selfJack }) {
        if (jack.node) {
          destination.connect(jack.node)
        }
      },
      onDisconnect({ jack, selfJack }) {
        if (jack.node) {
          destination.disconnect(jack.node)
        }
      },
      connectionValidator({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    }
  ]

  const [
    connector,
  ] = await Promise.all(
    jackIngredients.map(
      ingredients => makeJack(ingredients)
    )
  )

  container.addChild(
    connector.container
  )

  connector.container.on('broadcast', ({ jack, payload }) => {
    destination.connect(payload)
  })

  return {
    container,
    destination,
    universe,
    jacks: {
      connector
    }
  }
}