import { PIXI } from '../Utilities/localPIXI.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'
import { makeRect } from '../Utilities/makeRect.js'
import { makeEventForwarder } from '../Utilities/makeEventForwarder.js'
import * as cursors from '../Misc/cursors.js'

const makeDragRect = makeRectOptions => enableDragEvents(makeRect(makeRectOptions))

const {
  display,
  Graphics
} = PIXI

const {
  Layer,
  Stage
} = display

const BG_COLOR = 0xffd700 // 0x999999

export const makePlate = ({
  name = 'unnammed Plate',
  x,
  y,
  width,
  height,
  tint = BG_COLOR
}) => {
  let internalX = x
  let internalY = y

  const container = new Stage()
  const internalContainer = new Layer()
  const moveListeners = new Set()

  const emit = makeEventForwarder(internalContainer)

  container.x = internalX || container.x
  container.y = internalY || container.y

  const chromeMover = makeDragRect({
    x: 0,
    y: 0,
    width,
    height,
    tint,
    cursors: cursors.MOVE
  })

  const reorderZIndexes = () => {
    if (container.parent) {
      container.parent.children
        .sort((a, b) => (a.zIndex - b.zIndex))
        .map((child, index) => (
          child.zIndex = (child.zIndex !== index) ? (index) : (child.zIndex)
        ))
    }
  }

  const bringToFront = () => {
    if (container.parent) {
      container.zIndex = container.parent.children.length
      reorderZIndexes()
    }
  }

  const sendToBack = () => {
    container.zIndex = -1
    reorderZIndexes()
  }

  const bounds = {
    get globalTop () {
      return container.getGlobalPosition().y + height
    },
    get globalLeft () {
      return container.getGlobalPosition().x + width
    },
    get globalRight () {
      return container.getGlobalPosition().x
    },
    get globalBottom () {
      return container.getGlobalPosition().y
    },
    get rawTop () {
      return Math.min(container.y, chromeMover.y)
    },
    get top () {
      const { rawTop } = this
      return rawTop
    },
    get rawLeft () {
      return Math.min(container.x, chromeMover.x)
    },
    get left () {
      const { rawLeft } = this
      return rawLeft
    },
    get right () {
      return Math.max(container.x + chromeMover.width)
    },
    get bottom () {
      return Math.max(container.y + chromeMover.height)
    },
    get height () {
      const { bottom, top } = this
      return bottom - top
    },
    get width () {
      const { right, left } = this
      return right - left
    },
    get innerWidth () {
      const { width } = this
      return width
    },
    get mask () {
      const { globalTop, globalLeft, globalRight, globalBottom, marginSize, innerMargin } = this
      const x = globalLeft + innerMargin
      const y = globalTop + innerMargin
      const height = (globalBottom - globalTop) - (innerMargin * 2)
      const width = (globalRight - globalLeft) - (innerMargin * 2)
      return { height, width, x, y }
    },
    get minX () {
      return this.left
    },
    get maxX () {
      const { width, left, innerMargin, marginSize } = this
      return (left + width) - (innerMargin * 2) - marginSize
    },
    get minY () {
      return this.top
    },
    get maxY () {
      const { height, top, innerMargin, marginSize } = this
      return (top + height) - (innerMargin * 2) - marginSize
    },
    get centerX () {
      const { minX, maxX } = this
      return (minX + maxX) / 2
    },
    get centerY () {
      const { minY, maxY } = this
      return (minY + maxY) / 2
    }
  }

  function notifyMoveListeners () {
    moveListeners.forEach(listener => listener({ ...bounds }))
    emit('parent move', bounds)
  }

  container.addChild(chromeMover)
  container.addChild(internalContainer)

  chromeMover
    .on('dragstart', () => {
      container.alpha = 0.5
    })
    .on('dragend', () => {
      container.alpha = 1
    })
    .on('dragging', ({ pointerState: { startDelta: { x, y } } }) => {
      moveBy(x, y)
    })
    .on('pointerdown', () => {
      bringToFront()
    })

  container.on('parent move', bounds => {
    emit('parent move', bounds)
    notifyMoveListeners()
  })
  container.on('parent resize', bounds => {
    emit('parent resize', bounds)
    // notifyResizeListeners()
  })

  const output = {
    get name () {
      return name
    },
    get container () {
      return container
    },
    get internalContainer () {
      return internalContainer
    },
    moveTo,
    moveBy,
    get x () {
      return container.x
    },
    set x (newX) {
      internalX = newX
      container.x = newX
    },
    get y () {
      return container.y
    },
    set y (newY) {
      internalY = newY
      container.y = newY
    },
    addChild (...args) {
      internalContainer.addChild(...args)
      return () => this.removeChild(...args)
    },
    removeChild (...args) {
      internalContainer.removeChild(...args)
    }
  }

  function moveTo (x, y) {
    container.x = x
    container.y = y
    internalX = x
    internalY = y
    notifyMoveListeners()
  }

  function moveBy (x, y) {
    container.x += x
    container.y += y
    internalX += x
    internalY += y
    notifyMoveListeners()
  }

  return output
}
