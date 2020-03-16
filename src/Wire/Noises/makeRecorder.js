import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeText } from '../Parts/makeText.js'

import theme from '../Theme/imperfection/theme'
import { getGlobalAudioContext } from './getGlobalAudioContext.js'
import { PIXI } from '../Utilities/localPIXI.js'

const { Graphics, Ticker } = PIXI

const { recorderColor } = theme

const context = getGlobalAudioContext()

const RecorderTicker = Ticker.shared
RecorderTicker.autoStart = true

const FFTSIZE = 2048

const SCREEN_HEIGHT = 100
const SCREEN_WIDTH = 100

export const makeRecorder = async ({
  x,
  y,
  name = 'Unnammed Recorder',
  universe
}) => {
  const isRecording = false

  const plate = makePlate({ x, y, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, tint: recorderColor })

  const mediaStreamDestNode = context.createMediaStreamDestination()

  const internalConnections = new Set()
  const graphics = new Graphics()

  const { container } = plate

  const jackIngredients = [
    {
      x: 8,
      y: 8,
      name: `[${name}]'s connector jack`,
      themeImage: 'jackConnector',
      universe,
      kind: 'connector',
      get node () {
        return mediaStreamDestNode
      },
      onConnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node) === false) {
          mediaStreamDestNode.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          mediaStreamDestNode.disconnect(jack.node)
          internalConnections.delete(jack.node)
        }
      },
      connectionValidator ({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    },
    {
      x: 8,
      y: 40,
      name: `[${name}]'s start jack`,
      themeImage: 'jackRecord',
      kind: 'impulse',
      universe
    },
    {
      x: 32,
      y: 40,
      name: `[${name}]'s stop jack`,
      themeImage: 'jackStop',
      kind: 'impulse',
      universe
    }
  ]

  const [
    connectorJack,
    startJack,
    stopJack
  ] = await Promise.all(jackIngredients.map(ingredients => makeJack(ingredients)))

  startJack.container.on('broadcast', ({ jack, payload }) => {
    if (jack.kind === 'trigger') {
      const { eventName } = payload
      if (eventName === 'pointerdown') {

      }
    }
  })

  stopJack.container.on('broadcast', ({ jack, payload }) => {
    if (jack.kind === 'trigger') {
      const { eventName } = payload
      if (eventName === 'pointerdown') {

      }
    }
  })

  plate.addChild(
    connectorJack.container,
    startJack.container,
    stopJack.container
  )

  RecorderTicker.add(time => {
    // console.log('recorder-ticker-tick')
  })

  const recorderSelf = {
    name,
    container
  }

  return recorderSelf
}
