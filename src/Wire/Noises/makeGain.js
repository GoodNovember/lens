import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeText } from '../Parts/makeText.js'
import theme from '../Theme/imperfection/theme'

import { getGlobalAudioContext } from './getGlobalAudioContext.js'
const { gainColor } = theme

const context = getGlobalAudioContext()

export const makeGain = async ({
  x,
  y,
  name = '[unnamed gain]',
  universe
}) => {
  const plate = makePlate({
    x,
    y,
    width: 32,
    height: 64,
    tint: gainColor
  })
  const container = plate.container
  const internalConnections = new Set()
  const gainNode = context.createGain()

  const jackIngredients = [
    {
      x: 16,
      y: 32 + 17,
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
      x: 16,
      y: 16,
      name: `[${name}]'s gain jack`,
      themeImage: 'jackGain',
      universe,
      kind: 'audioParam',
      paramName: 'gain',
      get audioParam () {
        return gainNode.gain
      },
      get node () {
        return gainNode
      },
      onConnect ({ jack, selfJack }) {
        const { kind } = jack
        if (kind === 'connector') {
          console.log('WOW', jack)
        } else if (jack.node && internalConnections.has(jack.node) === false) {
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
        } else if (kind === 'connector') {
          return true
        } else {
          console.log('GAIN REJECT', jack, selfJack)
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

  const label = makeText('Gain')
  label.tint = 0x000000
  label.interactive = false
  label.x = 2
  label.y = 26

  plate.addChild(
    connector.container,
    gain.container,
    label
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
    container,
    gain: gainNode,
    universe,
    jacks: {
      connector
    }
  }
}
