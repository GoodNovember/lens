import { makeJack } from '../Anatomy/makeJack.js'
import { PIXI } from '../Utilities/localPIXI.js'
import { connectorValidator } from './validators/connectorValidator.js'

const { Container } = PIXI
export const makeOscillator = async ({
  x,
  y,
  name = `[unnamed oscillator]`,
  context,
  universe
}) => {
  const container = new Container()
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
        if (jack.node) {
          oscillator.connect(jack.node)
        }
      },
      onDisconnect({ jack, selfJack }) {
        if (jack.node) {
          oscillator.disconnect(jack.node)
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
    connector,
  ] = await Promise.all(
    jackIngredients.map(
      ingredients => makeJack(ingredients)
    )
  )

  container.addChild(
    detune.container,
    frequency.container,
    type.container,
    start.container,
    stop.container,
    connector.container
  )

  console.log('osc', oscillator)

  detune.container.on('broadcast', ({ jack, payload }) => {
    const { maxValue, minValue, defaultValue, automationRate } = oscillator.detune
    if (typeof payload === 'number') {
      oscillator.detune.value = Math.max(minValue, Math.min(payload, maxValue))
    } else {
      oscillator.detune.value = defaultValue
    }
  })

  frequency.container.on('broadcast', ({ jack, payload }) => {
    const { maxValue, minValue, defaultValue, automationRate } = oscillator.frequency
    if (typeof payload === 'number') {
      oscillator.frequency.value = Math.max(minValue, Math.min(payload, maxValue))
    } else {
      oscillator.frequency.value = defaultValue
    }
  })

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

  start.container.on('broadcast', ({ jack, payload }) => {
    console.log(`OSC ${name} Playing`)
    oscillator.start(payload)
  })

  stop.container.on('broadcast', ({ jack, payload }) => {
    console.log(`OSC ${name} Stopped`)
    oscillator.stop(payload)
  })

  connector.container.on('broadcast', ({ jack, payload }) => {
    oscillator.connect(payload)
  })

  function setupOscilator() {
    oscillator = null
    oscillator = context.createOscillator()
    oscillator.onended = () => {
      console.log('Oscilator ended.')
      setupOscilator()
      for (const jack of connector.connections) {
        if (jack.node) {
          oscillator.connect(jack.node)
        }
      }
    }
  }

  return {
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