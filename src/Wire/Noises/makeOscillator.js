import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makeToolbox } from '../Parts/makeToolbox.js'
import { lerp } from '../Utilities/lerp.js'

export const makeOscillator = async ({
  x,
  y,
  name = '[unnamed oscillator]',
  context,
  universe
}) => {
  const toolbox = makeToolbox({
    x,
    y,
    name: `[${name}]'s toolbox`,
    width: 200,
    height: 200
  })
  const container = toolbox.container
  const internalConnections = new Set()
  let canPlay = false
  let canStop = false
  let oscillator = context.createOscillator()
  setupOscilator()
  container.x = x
  container.y = y

  const jackIngredients = [
    {
      x: 8,
      y: 8,
      name: `[${name}]'s detune jack`,
      themeImage: 'jackDetune',
      universe
    },
    {
      x: 24,
      y: 8,
      name: `[${name}]'s frequency jack`,
      themeImage: 'jackFrequency',
      universe
    },
    {
      x: 40,
      y: 8,
      name: `[${name}]'s type jack`,
      themeImage: 'jackType',
      universe
    },
    {
      x: 8,
      y: 24,
      name: `[${name}]'s start jack`,
      themeImage: 'jackStart',
      universe
    },
    {
      x: 8,
      y: 40,
      name: `[${name}]'s stop jack`,
      themeImage: 'jackStop',
      universe
    },
    {
      x: 8,
      y: 56,
      name: `[${name}]'s connector jack`,
      themeImage: 'jackConnector',
      universe,
      kind: 'connector',
      get node() {
        return oscillator
      },
      onConnect({ jack, selfJack }) {
        console.log('CONNECT to oscilator')
        if (jack.node && internalConnections.has(jack.node) === false) {
          try {
            oscillator.connect(jack.node)
            internalConnections.add(jack.node)
          } catch (e) {
            console.error('hmm. connect.', e)
          }
        }
      },
      onDisconnect({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          try {
            internalConnections.delete(jack.node)
            console.log('DISCONNECTING OSCILATOR FROM OTHER NODE')
            oscillator.disconnect(jack.node)
          } catch (e) {
            console.error('hmm. disconnect.', e)
          }
        }
      },
      connectionValidator({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    }
  ]

  const [
    detune,
    frequency,
    type,
    start,
    stop,
    connector
  ] = await Promise.all(jackIngredients.map(ingredients => makeJack(ingredients)))

  toolbox.addChild(
    detune.container,
    frequency.container,
    type.container,
    start.container,
    stop.container,
    connector.container
  )

  // when we get something from the Detune Jack...
  detune.container.on('broadcast', ({ jack, payload }) => {
    const { maxValue, minValue, defaultValue, automationRate } = oscillator.detune
    if (jack.kind === 'zero-to-one') {
      const { x } = payload
      const min = minValue
      const max = maxValue
      const value = lerp({ norm: x, min, max })
      oscillator.detune.setValueAtTime(value, context.currentTime)
    }
  })

  // when we get something from the Frequency Jack...
  frequency.container.on('broadcast', ({ jack, payload }) => {
    const { maxValue, minValue, defaultValue, automationRate } = oscillator.frequency
    if (jack.kind === 'zero-to-one') {
      const { x } = payload // we extract the (0.0 -> 1.0) value for the horizontal.
      const min = minValue
      const max = maxValue
      const value = lerp({ norm: x, min, max })
      oscillator.frequency.setValueAtTime(value, context.currentTime)
    }
  })

  // when we get something from the Type Jack...
  type.container.on('broadcast', ({ jack, payload }) => {
    const defaultValue = 'sine'
    const validTypes = [
      'sine',
      'square',
      'sawtooth',
      'triangle',
      'custom'
    ]
    if (validTypes.indexOf(payload) > -1) {
      oscillator.type = payload
    } else {
      oscillator.type = defaultValue
    }
  })

  // when we get something from the Start Jack...
  start.container.on('broadcast', ({ jack, payload }) => {
    if (jack.kind === 'trigger') {
      const { eventName } = payload
      if (eventName === 'pointerdown') {
        if (canPlay) {
          canPlay = false
          oscillator.start(0) // play right now is 0
          canStop = true
        }
      }
    }
  })

  // when we get something from the Stop Jack...
  stop.container.on('broadcast', ({ jack, payload }) => {
    if (jack.kind === 'trigger') {
      const { eventName } = payload
      if (eventName === 'pointerdown') {
        if (canStop) {
          canStop = false
          oscillator.stop(0) // stop right now is 0
        }
      }
    }
  })

  // here, we recieve connections concerning WebAudio API nodes. yep.
  connector.container.on('broadcast', ({ jack, payload }) => {
    try {
      oscillator.connect(payload)
    } catch (error) {
      console.error(`
[${name}] (you know, the Oscillator) 
did not want to ".connect()" to the honorable Jack: [${jack.name}]'s payload.
Payload:
${payload}
`, { error })
    }
  })

  function setupOscilator() {
    canPlay = false
    const newOsc = context.createOscillator()
    newOsc.frequency.value = oscillator.frequency.value
    newOsc.detune.value = oscillator.detune.value
    newOsc.type = oscillator.type
    newOsc.onended = () => {
      setTimeout(() => {
        setupOscilator()
        for (const jack of connector.connections) {
          if (jack.node) {
            oscillator.connect(jack.node)
          }
        }
      }, 0) // just in case, we don't want any stack overflows.
    }
    oscillator = null
    oscillator = newOsc
    canPlay = true
  }

  return {
    toolbox,
    container,
    oscillator,
    universe,
    jacks: {
      type,
      detune,
      frequency
    }
  }
}
