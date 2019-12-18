import { makeJack } from '../Anatomy/makeJack.js'
import { makeToolbox } from '../Parts/makeToolbox.js'
import { makeRect } from '../Utilities/makeRect.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'
import { norm } from '../Utilities/norm.js'

const makeDraggableRect = ({ ...rest }) => enableDragEvents(makeRect({ ...rest }))

export const makeRange = async ({
  x,
  y,
  name = '[unnamed range]',
  initialValue = 0,
  universe
}) => {
  let jacksAreRenderable = false // this flag is set to true later.
  let internalPlacementX = 0.5 // we start in the middle
  let internalPlacementY = 0.5

  const internalMinValue = -Infinity
  let internalValue = initialValue
  const internalMaxValue = Infinity

  const toolbox = makeToolbox({ width: 500, height: 100, x, y, hideBox: true })

  const middle = makeRect({ x: 0, y: 0, width: 8, height: 8, interactive: true, tint: 0x0000ff })
  middle.anchor.set(0.5)
  middle.angle = 45

  const dragSurface = makeDraggableRect({ x: 0, y: 0, width: 16, height: 32, tint: 0xcccccc })

  const currentEdge = makeDraggableRect({ x: 0, y: 0, width: 16, height: 32 })

  const debugLine = makeRect({ x: 0, y: 0, width: 1, height: 100, tint: 0xff00ff })

  const leftLine = makeRect({ x: 0, y: 0, width: 2, height: 100, tint: 0x0000ff })
  const rightLine = makeRect({ x: 0, y: 0, width: 2, height: 100, tint: 0xff0000 })

  currentEdge.anchor.set(0.5, 0)
  debugLine.anchor.set(0.5)
  leftLine.anchor.set(0.5)
  rightLine.anchor.set(0.5)
  dragSurface.anchor.set(0.5)

  toolbox.subscribeToResize(() => {
    updateVisuals()
  })

  const { container } = toolbox

  toolbox.addChild(
    dragSurface,
    currentEdge,
    middle,
    debugLine,
    leftLine,
    rightLine
  )

  const jacks = await Promise.all([
    makeJack({
      x: 0,
      y: 0,
      name: `[${name}]'s minJack`,
      themeImage: 'jackNumber',
      universe
    }),
    makeJack({
      x: 32,
      y: 32,
      name: `[${name}]'s maxJack`,
      themeImage: 'jackNumber',
      universe
    }),
    makeJack({
      x: 10,
      y: 10,
      name: `[${name}]'s valueJack`,
      kind: 'zero-to-one',
      themeImage: 'jackZeroToOne',
      universe
    })
  ])

  jacks.map(({ container }) => { toolbox.addChild(container) })

  jacksAreRenderable = true

  const [
    minJack,
    maxJack,
    valueJack
  ] = jacks

  valueJack.container.on('broadcast', ({ payload }) => {
    const value = Math.max(0, Math.min(1, payload))
    if (internalValue !== value) {
      internalValue = value
      console.log(`Value Change From External. ${internalValue} / ${value}`)
    }
  })

  function CalculatePlacements ({ x, y }) {
    const { bounds } = toolbox

    let newXPlacement = 0
    let newYPlacement = 0

    const {
      minX, maxX,
      minY, maxY
    } = bounds

    newXPlacement = norm({ value: x, min: minX, max: maxX })
    if (newXPlacement < 0) {
      newXPlacement = 0
    } else if (newXPlacement > 1) {
      newXPlacement = 1
    }

    newYPlacement = norm({ value: y, min: minY, max: maxY })
    if (newYPlacement < 0) {
      newYPlacement = 0
    } else if (newYPlacement > 1) {
      newYPlacement = 1
    }

    internalPlacementX = newXPlacement
    internalPlacementY = newYPlacement

    valueJack.broadcastToConnections({
      x: internalPlacementX
      // y: internalPlacementY // currently, we just use X
    })
  }

  currentEdge.on('dragging', handleDragEvents)
  dragSurface.on('dragstart', handleDragEvents)
  dragSurface.on('dragging', handleDragEvents)

  function handleDragEvents ({ pointerState: { current: { x, y } } }) {
    CalculatePlacements({ x, y })
    updateVisuals()
  }

  function updateVisuals () {
    const { bounds } = toolbox

    const {
      top,
      height,
      width,
      centerX,
      centerY,
      innerMargin,
      maxX,
      minX
    } = bounds

    const currentX = ((maxX + minX) * internalPlacementX)

    middle.x = currentX
    middle.y = centerY

    currentEdge.x = currentX
    currentEdge.y = top - innerMargin
    currentEdge.height = height

    debugLine.x = centerX
    debugLine.y = centerY

    leftLine.x = minX
    leftLine.y = centerY

    rightLine.x = maxX
    rightLine.y = centerY

    dragSurface.x = centerX
    dragSurface.y = centerY
    dragSurface.width = width
    dragSurface.height = height

    if (jacksAreRenderable) {
      valueJack.container.x = centerX
      valueJack.container.y = height - 64 + 16
    }
  }

  return {
    toolbox,
    container
  }
}
