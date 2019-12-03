import { makeJack } from '../Anatomy/makeJack.js'
import { PIXI } from '../Utilities/localPIXI.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makeToolbox } from '../Parts/makeToolbox.js'
export const makeDestination = async ({
  x,
  y,
  name = `[unnamed destination]`,
  context,
  universe
}) => {
  const toolbox = makeToolbox({
    x,
    y,
    name: `[${name}]'s toolbox`,
    width: 100,
    height: 100
  })
  const container = toolbox.container
  const internalConnections = new Set()
  const { destination } = context

  toolbox

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
        if (jack.node && internalConnections.has(jack.node) === false) {
          destination.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          internalConnections.delete(jack.node)
          jack.node.disconnect(destination) // the destination is always last.
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

  toolbox.addChild(
    connector.container
  )

  connector.container.on('broadcast', ({ jack, payload }) => {
    destination.connect(payload)
  })

  return {
    toolbox,
    container,
    destination,
    universe,
    jacks: {
      connector
    }
  }
}