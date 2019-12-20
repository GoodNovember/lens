import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeText } from '../Parts/makeText.js'

export const makeDestination = async ({
  x,
  y,
  name = '[unnamed destination]',
  context,
  universe
}) => {
  const plate = makePlate({
    x,
    y,
    name: `[${name}]'s plate`,
    width: 200,
    height: 32
  })
  const container = plate.container
  const internalConnections = new Set()
  const { destination } = context

  container.x = x
  container.y = y

  const jackIngredients = [
    {
      x: 16,
      y: 16,
      name: `[${name}]'s connector jack`,
      themeImage: 'jackConnector',
      universe,
      kind: 'connector',
      get node () {
        return destination
      },
      onConnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node) === false) {
          destination.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          internalConnections.delete(jack.node)
          jack.node.disconnect(destination) // the destination is always last.
        }
      },
      connectionValidator ({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    }
  ]

  const [
    connector
  ] = await Promise.all(
    jackIngredients.map(
      ingredients => makeJack(ingredients)
    )
  )

  const label = makeText('Speakers (destination)')
  label.tint = 0x000000
  label.interactive = false
  label.x = 32
  label.y = 9

  plate.addChild(
    connector.container,
    label
  )

  connector.container.on('broadcast', ({ jack, payload }) => {
    destination.connect(payload)
  })

  return {
    toolbox: plate,
    container,
    destination,
    universe,
    jacks: {
      connector
    }
  }
}
