import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeText } from '../Parts/makeText.js'
import theme from '../Theme/imperfection/theme'
import { getGlobalAudioContext } from './getGlobalAudioContext.js'
import { PIXI } from '../Utilities/localPIXI.js'

const { Graphics, Ticker } = PIXI

const { analyserColor } = theme

const context = getGlobalAudioContext()

const AnalysisTicker = Ticker.shared
AnalysisTicker.autoStart = true

const FFTSIZE = 2048

const SCREEN_HEIGHT = 300
const SCREEN_WIDTH = 500

export const makeAnalyser = async ({
  x,
  y,
  name = 'Unnammed Analyser',
  universe,
  mode = 'time' // 'time' and 'frequency'
}) => {
  const plate = makePlate({ x, y, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, tint: analyserColor })

  const analyserNode = context.createAnalyser()
  analyserNode.fftSize = FFTSIZE

  const internalConnections = new Set()
  const graphics = new Graphics()

  const { container } = plate

  const jackIngredients = [
    {
      x: 16,
      y: 16,
      name: `[${name}]'s connector jack`,
      themeImage: 'jackConnector',
      universe,
      kind: 'connector',
      get node () {
        return analyserNode
      },
      onConnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node) === false) {
          analyserNode.connect(jack.node)
          internalConnections.add(jack.node)
        }
      },
      onDisconnect ({ jack, selfJack }) {
        if (jack.node && internalConnections.has(jack.node)) {
          analyserNode.disconnect(jack.node)
          internalConnections.delete(jack.node)
        }
      },
      connectionValidator ({ jack, selfJack, ...rest }) {
        return connectorValidator({ jack, selfJack, ...rest })
      }
    }
  ]

  const [
    connectorJack
  ] = await Promise.all(jackIngredients.map(ingredients => makeJack(ingredients)))

  plate.addChild(
    graphics,
    connectorJack.container
  )

  graphics.beginFill(0xff00ff, 1.0)
  graphics.drawCircle(0, 0, 1)

  const bufferLength = analyserNode.frequencyBinCount
  const TimeFloatData = new Float32Array(bufferLength)
  const FrequencyFloatData = new Float32Array(bufferLength)

  const drawTimeData = () => {
    let x = 0
    const sliceWidth = SCREEN_WIDTH / bufferLength
    const halfHeight = SCREEN_HEIGHT / 2

    graphics.clear()
    graphics.lineStyle(2, 0xff00ff)
    graphics.moveTo(0, plate.height / 2)

    for (const value of TimeFloatData) {
      const y = (value / 2) * halfHeight * -1
      graphics.lineTo(x, y + halfHeight, 1)
      x += sliceWidth
    }
  }
  const drawFrequencyData = () => {
    let x = 0
    const sliceWidth = SCREEN_WIDTH / bufferLength
    const halfHeight = SCREEN_HEIGHT / 2

    graphics.clear()
    graphics.lineStyle(2, 0xff00ff)
    graphics.moveTo(0, plate.height / 2)

    console.log({ FrequencyFloatData })

    for (const value of FrequencyFloatData) {
      if (value < Infinity) {
        const y = ((value * -1) / 128.0) * halfHeight
        if (y < SCREEN_HEIGHT) {
          graphics.lineTo(x, y, 1)
          x += sliceWidth
        }
      }
    }
  }

  AnalysisTicker.add(time => {
    if (mode === 'time') {
      analyserNode.getFloatTimeDomainData(TimeFloatData)
      drawTimeData()
    } else if (mode === 'frequency') {
      analyserNode.getFloatFrequencyData(FrequencyFloatData)
      drawFrequencyData()
    }
  })

  const analyserSelf = {
    name,
    container
  }

  return analyserSelf
}
