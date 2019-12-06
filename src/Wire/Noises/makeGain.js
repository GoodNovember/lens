import { makeJack } from '../Anatomy/makeJack.js'
import { PIXI } from '../Utilities/localPIXI.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makeToolbox } from '../Parts/makeToolbox.js'
export const makeGain = async ({
  x,
  y,
  name = `[unnamed gain]`,
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
  const gainNode = context.createGain()

  const jackIngredients = [
    {
      x: 8,
      y: 8,
      name: `[${name}]'s connector jack`,
      themeImage: 'jackConnector',
      universe,
      kind: 'connector',
      get node() {
        return gainNode
      },
      onConnect({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node) === false) {
          gainNode.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          internalConnections.delete(jack.node)
          jack.node.disconnect(gainNode) // the destination is always last.
        }
      },
      connectionValidator({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    },
    {
      x: 8 + 26,
      y: 8 + 26,
      name: `[${name}]'s gain jack`,
      themeImage: 'jackGain',
      universe,
      kind: 'gain',
      get node() {
        return gainNode
      },
      onConnect({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node) === false) {
          gainNode.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          internalConnections.delete(jack.node)
          jack.node.disconnect(gainNode) // the destination is always last.
        }
      },
      connectionValidator({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    }
  ]

  const [
    connector,
    gain,
  ] = await Promise.all(
    jackIngredients.map(
      ingredients => makeJack(ingredients)
    )
  )

  toolbox.addChild(
    connector.container,
    gain.container
  )

  connector.container.on('broadcast', ({ jack, payload }) => {
    destination.connect(payload)
  })

  return {
    toolbox,
    container,
    gain: gainNode,
    universe,
    jacks: {
      connector
    }
  }
}