import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makeToolbox } from '../Parts/makeToolbox.js'

export const makeGain = async ({
  x,
  y,
  name = '[unnamed gain]',
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
      get node () {
        return gainNode
      },
      onConnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node) === false) {
          gainNode.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          gainNode.disconnect(jack.node)
          internalConnections.delete(jack.node)
        }
      },
      connectionValidator ({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    },
    {
      x: 8 + 16,
      y: 8,
      name: `[${name}]'s gain jack`,
      themeImage: 'jackGain',
      universe,
      kind: 'gain',
      get node () {
        return gainNode
      },
      onConnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node) === false) {
          gainNode.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          internalConnections.delete(jack.node)
          gainNode.disconnect(jack.node)
        }
      },
      connectionValidator ({ jack, selfJack, ...rest }) {
        const { kind } = jack
        if (kind === 'zero-to-one') {
          return true
        } else {
          return false
        }
      }
    }
  ]

  const [
    connector,
    gain
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
    gainNode.connect(payload)
  })

  gain.container.on('broadcast', ({ jack, payload }) => {
    if (jack.kind === 'zero-to-one') {
      const { x } = payload
      gainNode.gain.value = x
    }
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
