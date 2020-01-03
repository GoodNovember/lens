import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { lerp } from '../Utilities/lerp.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeText } from '../Parts/makeText.js'
import theme from '../Theme/imperfection/theme'
import { getGlobalAudioContext } from './getGlobalAudioContext.js'
const context = getGlobalAudioContext()

const { oscillatorColor } = theme

export const makeOscillator = async ({
  x,
  y,
  name = '[unnamed oscillator]',
  universe
}) => {
  const plate = makePlate({
    x,
    y,
    width: 86,
    height: 64,
    tint: oscillatorColor
  })
  const container = plate.container
  const internalConnections = new Set()
  let canPlay = false
  let canStop = false
  let oscillator = context.createOscillator()
  setupOscilator()
  container.x = x
  container.y = y

  const jackIngredients = [
    {
      x: 16,
      y: 16,
      name: `[${name}]'s detune jack`,
      themeImage: 'jackDetune',
      kind: 'audioParam',
      paramName: 'detune',
      get audioParam() {
        return oscillator.detune
      },
      node: oscillator,
      universe
    },
    {
      x: 42,
      y: 16,
      name: `[${name}]'s frequency jack`,
      themeImage: 'jackFrequency',
      kind: 'audioParam',
      node: oscillator,
      get audioParam() {
        return oscillator.frequency
      },
      universe
    },
    {
      x: 70,
      y: 16,
      name: `[${name}]'s type jack`,
      themeImage: 'jackType',
      kind: 'string',
      universe
    },
    {
      x: 16,
      y: 48,
      name: `[${name}]'s start jack`,
      themeImage: 'jackStart',
      kind: 'impulse',
      universe
    },
    {
      x: 32,
      y: 48,
      name: `[${name}]'s stop jack`,
      themeImage: 'jackStop',
      kind: 'impulse',
      universe
    },
    {
      x: 70,
      y: 48,
      name: `[${name}]'s connector jack`,
      themeImage: 'jackConnector',
      universe,
      kind: 'connector',
      get node() {
        return oscillator
      },
      onConnect({ jack, selfJack }) {
        console.log('CONNECT to oscillator')
        const { kind, node } = jack
        if (kind === 'audioParam') {
          const { audioParam } = jack
          console.assert(audioParam, 'jack.audioParam exists')
          console.assert(internalConnections.has(audioParam) === false, 'i am not connected to AudioParam')
          if (audioParam && internalConnections.has(audioParam) === false) {
            console.log(`OSC ${name} will now control ${jack.name}`)
            oscillator.connect(audioParam)
            internalConnections.add(audioParam)
            console.assert(internalConnections.has(audioParam), 'audioParam has been added to internal connections')
          } else {
            console.error({ audioParam, jack })
          }
        } else if (kind === 'connector') {
          if (node && internalConnections.has(node) === false) {
            try {
              oscillator.connect(node)
              internalConnections.add(node)
              console.assert(internalConnections.has(node), 'node has been added to internal connections')
            } catch (e) {
              console.error('hmm. connect.', e)
            }
          }
        } else {
          console.error('Unhandled connection Request', { jack })
        }
      },
      onDisconnect({ jack, selfJack }) {
        const { kind, node } = jack
        if (kind === 'audioParam') {
          const { audioParam } = jack
          console.assert(audioParam, 'jack.audioParam exists')
          if (audioParam && internalConnections.has(audioParam)) {
            try {
              internalConnections.delete(audioParam)
              oscillator.disconnect(audioParam)
              console.log(`OSC ${name} will no longer control ${jack.name}`)
            } catch (e) {
              console.error('hmm. disconnect param')
            }
          }
        } else if (kind === 'connector') {
          console.assert(node, 'jack.node exists')
          if (node && internalConnections.has(node)) {
            try {
              internalConnections.delete(node)
              console.log('DISCONNECTING OSCILATOR FROM OTHER NODE')
              oscillator.disconnect(node)
            } catch (e) {
              console.error('hmm. disconnect.', e)
            }
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

  const label = makeText('Oscillator')
  label.tint = 0x000000
  label.interactive = false
  label.x = 8
  label.y = 26

  plate.addChild(
    detune.container,
    frequency.container,
    type.container,
    start.container,
    stop.container,
    connector.container,
    label
  )

  // when we get something from the Detune Jack...
  detune.container.on('broadcast', ({ jack, payload }) => {
    const { maxValue, minValue, defaultValue, automationRate } = oscillator.detune
    if (jack.kind === 'zero-to-one') {
      const { x } = payload
      // const min = minValue
      // const min = 0
      // const max = maxValue
      const value = lerp({ norm: x, min: minValue, max: maxValue })
      oscillator.detune.setValueAtTime(value, context.currentTime)
    }
  })

  // when we get something from the Frequency Jack...
  frequency.container.on('broadcast', ({ jack, payload }) => {
    const { maxValue, minValue, defaultValue, automationRate } = oscillator.frequency
    if (jack.kind === 'zero-to-one') {
      const { x } = payload // we extract the (0.0 -> 1.0) value for the horizontal.
      // const min = minValue
      // const min = 440 / 2
      // const max = 440
      // const value = lerp({ norm: x, min, max })
      const value = lerp({ norm: x, min: minValue, max: maxValue })
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
        for (const node of internalConnections) {
          oscillator.connect(node)
        }
      }, 0) // just in case, we don't want any stack overflows.
    }
    oscillator = null
    oscillator = newOsc
    canPlay = true
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
