import { makeJack } from '../Anatomy/makeJack.js'
import { makeToolbox } from '../Parts/makeToolbox.js'
import { makeRect } from '../Utilities/makeRect.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'

const makeDraggableRect = ({ ...rest }) => enableDragEvents(makeRect({ ...rest }))

export const makeRange = async ({
  x,
  y,
  name = '[unnamed range]',
  initialValue = 0,
  universe
}) => {
  let internalPlacementX = 0.5

  let internalMinValue = -Infinity
  let internalValue = initialValue
  let internalMaxValue = Infinity

  const toolbox = makeToolbox({ width: 500, height: 100, x: 64, y: 64 })
  toolbox.x = x
  toolbox.y = y

  const middle = makeRect({ x: 0, y: 0, width: 8, height: 8, interactive: true, tint: 0x0000ff })
  middle.anchor.set(0.5)
  middle.angle = 45

  const leftEdge = makeRect({ x: 0, y: 0, width: 8, height: 32, interactive: true })
  const rightEdge = makeRect({ x: 200 - 8, y: 0, width: 8, height: 32, interactive: true })
  const currentEdge = makeDraggableRect({ x: 0, y: 0, width: 16, height: 32, interactive: true })

  const debugLine = makeRect({ x: 0, y: 0, width: 1, height: 100, tint: 0xff00ff })

  currentEdge.anchor.set(0.5, 0)
  debugLine.anchor.set(0.5)

  currentEdge.on('dragging', ({ pointerState: { startDelta: { x, y }, current } }) => {
    const { bounds } = toolbox

    const {
      maxX
    } = bounds

    internalPlacementX = (current.x / maxX)
    currentEdge.x = internalPlacementX * maxX
    updateVisuals()
  })

  const updateVisuals = () => {
    const { bounds } = toolbox

    const {
      rawLeft,
      rawTop,
      top,
      height,
      centerX,
      centerY,
      innerMargin,
      maxX
    } = bounds

    const currentX = (maxX * internalPlacementX)

    middle.x = currentX
    middle.y = centerY

    leftEdge.x = rawLeft
    leftEdge.y = rawTop
    leftEdge.height = height

    rightEdge.x = maxX - 8
    rightEdge.y = top - innerMargin
    rightEdge.height = height

    currentEdge.x = currentX
    currentEdge.y = top - innerMargin
    currentEdge.height = height

    debugLine.x = centerX
    debugLine.y = centerY
  }

  toolbox.subscribeToResize(() => {
    updateVisuals()
  })

  const { container } = toolbox

  toolbox.addChild(
    leftEdge,
    rightEdge,
    currentEdge,
    middle,
    debugLine
  )

  const jacks = await Promise.all([
    makeJack({
      x: 0,
      y: 0,
      name: `[${name}]'s minJack`,
      universe
    }),
    makeJack({
      x: 32,
      y: 32,
      name: `[${name}]'s maxJack`,
      universe
    }),
    makeJack({
      x: 10,
      y: 10,
      name: `[${name}]'s valueJack`,
      universe
    })
  ])

  // jacks.map(({ container }) => { toolbox.addChild(container) })

  const [
    minJack,
    maxJack,
    valueJack
  ] = jacks

  minJack.container.on('broadcast', ({ payload }) => {
    internalMinValue = payload
    if (internalValue < internalMinValue) {
      internalValue = internalMinValue
      valueJack.broadcastToConnections(payload)
    }
  })

  maxJack.container.on('broadcast', ({ payload }) => {
    internalMaxValue = payload
    if (internalValue > internalMaxValue) {
      internalValue = internalMaxValue
      valueJack.broadcastToConnections(payload)
    }
  })

  valueJack.container.on('broadcast', ({ payload }) => {
    const min = Math.min(internalMaxValue, internalMinValue)
    const max = Math.max(internalMaxValue, internalMinValue)
    const value = Math.max(min, Math.min(max, payload))
    if (internalValue !== value) {
      console.log(`Value Change From External. ${internalValue} / ${value}`)
    }
  })

  return {
    toolbox,
    container
  }
}
