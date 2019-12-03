import { makeEventForwarder } from '../Utilities/makeEventForwarder.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'
import { makeRect } from '../Utilities/makeRect.js'
import { PIXI } from '../Utilities/localPIXI.js'
import * as cursors from '../Misc/cursors.js'

const {
  display,
  Graphics
} = PIXI

const {
  Layer,
  Stage
} = display

const TOOLBOX_MIN_WIDTH = 32
const TOOLBOX_MIN_HEIGHT = 32

const INNER_MARGIN = 16

const MARGIN_SIZE = 8
const CORNER_SIZE = 16

const HALF_MARGIN_SIZE = MARGIN_SIZE / 2

const CORNER_COLOR = 0x999999 // 0xaaaaaa
const EDGE_COLOR = 0x999999 // 0xeeeeee
const BG_COLOR = 0xbbbbbb // 0x999999
const BOX_COLOR = 0x000000

const DRAGGING_ALPHA = 0.75

const makeBatchEventHandler = eventName => callback => itemArray => itemArray.map(item => item.on(eventName, callback))

const makeDragRect = makeRectOptions => enableDragEvents(makeRect(makeRectOptions))

export const makeToolbox = ({
  width, height, x, y,
  hideBox = false,
  mode = 'BOTH'
}) => {
  const container = new Stage()

  container.x = x || container.x
  container.y = y || container.y

  const resizeListeners = new Set()
  const moveListeners = new Set()

  const chromeLayer = new Layer()
  container.addChild(chromeLayer)

  const internalContainer = new Layer()
  container.addChild(internalContainer)

  const emit = makeEventForwarder(internalContainer)

  const on = (eventName, callback) => {
    container.on(eventName, callback)
  }

  const chromeBoxGraphics = new Graphics()

  on('parent resize', () => {
    drawMask()
  })

  on('parent move', () => {
    drawMask()
  })

  internalContainer.x = INNER_MARGIN + MARGIN_SIZE
  internalContainer.y = INNER_MARGIN + MARGIN_SIZE

  // Mover

  const chromeMover = makeDragRect({
    x: MARGIN_SIZE,
    y: MARGIN_SIZE,
    width: width - (MARGIN_SIZE * 2),
    height: height - (MARGIN_SIZE * 2),
    tint: BG_COLOR,
    cursors: cursors.MOVE
  })

  // Edges

  const chromeTopSizer = makeDragRect({
    x: CORNER_SIZE,
    y: 0,
    width: width - (CORNER_SIZE * 2),
    height: MARGIN_SIZE,
    cursor: cursors.NS_RESIZE,
    tint: EDGE_COLOR
  })
  const chromeLeftSizer = makeDragRect({
    x: 0,
    y: CORNER_SIZE,
    width: MARGIN_SIZE,
    height: height - (CORNER_SIZE * 2),
    cursor: cursors.EW_RESIZE,
    tint: EDGE_COLOR
  })
  const chromeRightSizer = makeDragRect({
    x: width - (MARGIN_SIZE * 1),
    y: CORNER_SIZE,
    width: MARGIN_SIZE,
    height: height - (CORNER_SIZE * 2),
    cursor: cursors.EW_RESIZE,
    tint: EDGE_COLOR
  })
  const chromeBottomSizer = makeDragRect({
    x: CORNER_SIZE,
    y: height - (MARGIN_SIZE * 1),
    width: width - (CORNER_SIZE * 2),
    height: MARGIN_SIZE,
    cursor: cursors.NS_RESIZE,
    tint: EDGE_COLOR
  })

  // Top Left Corner

  const chromeTopLeftCornerTop = makeDragRect({
    x: MARGIN_SIZE,
    y: 0,
    width: CORNER_SIZE - MARGIN_SIZE,
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NWSE_RESIZE
  })
  const chromeTopLeftCornerLeft = makeDragRect({
    x: 0,
    y: MARGIN_SIZE,
    width: MARGIN_SIZE,
    height: CORNER_SIZE - MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NWSE_RESIZE
  })
  const chromeTopLeftCornerTopLeft = makeDragRect({
    x: 0,
    y: 0,
    width: MARGIN_SIZE,
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NWSE_RESIZE
  })

  // Top Right Corner

  const chromeTopRightCornerTop = makeDragRect({
    x: width - (CORNER_SIZE * 1),
    y: 0,
    width: CORNER_SIZE - MARGIN_SIZE,
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NESW_RESIZE
  })
  const chromeTopRightCornerRight = makeDragRect({
    x: width - (MARGIN_SIZE * 1),
    y: MARGIN_SIZE,
    width: MARGIN_SIZE,
    height: CORNER_SIZE - MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NESW_RESIZE
  })
  const chromeTopRightCornerTopRight = makeDragRect({
    x: width - (MARGIN_SIZE * 1),
    y: 0,
    width: MARGIN_SIZE,
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NESW_RESIZE
  })

  // Bottom Left Corner

  const chromeBottomLeftCornerLeft = makeDragRect({
    x: 0,
    y: height - CORNER_SIZE,
    width: MARGIN_SIZE,
    height: (CORNER_SIZE - MARGIN_SIZE),
    tint: CORNER_COLOR,
    cursor: cursors.NESW_RESIZE
  })
  const chromeBottomLeftCornerBottom = makeDragRect({
    x: MARGIN_SIZE,
    y: height - MARGIN_SIZE,
    width: (CORNER_SIZE - MARGIN_SIZE),
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NESW_RESIZE
  })
  const chromeBottomLeftCornerBottomLeft = makeDragRect({
    x: 0,
    y: height - MARGIN_SIZE,
    width: MARGIN_SIZE,
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NESW_RESIZE
  })

  // Bottom Right Corner

  const chromeBottomRightCornerRight = makeDragRect({
    x: width - MARGIN_SIZE,
    y: height - CORNER_SIZE,
    width: MARGIN_SIZE,
    height: CORNER_SIZE - MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NWSE_RESIZE
  })
  const chromeBottomRightCornerBottom = makeDragRect({
    x: width - CORNER_SIZE,
    y: height - MARGIN_SIZE,
    width: CORNER_SIZE - MARGIN_SIZE,
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NWSE_RESIZE
  })
  const chromeBottomRightCornerBottomRight = makeDragRect({
    x: width - MARGIN_SIZE,
    y: height - MARGIN_SIZE,
    width: MARGIN_SIZE,
    height: MARGIN_SIZE,
    tint: CORNER_COLOR,
    cursor: cursors.NWSE_RESIZE
  })

  const parts = {
    get leftParts () {
      return [
        chromeLeftSizer,
        chromeTopLeftCornerLeft,
        chromeTopLeftCornerTopLeft,
        chromeBottomLeftCornerLeft,
        chromeBottomLeftCornerBottomLeft
      ]
    },
    get rightParts () {
      return [
        chromeRightSizer,
        chromeTopRightCornerRight,
        chromeTopRightCornerTopRight,
        chromeBottomRightCornerRight,
        chromeBottomRightCornerBottomRight
      ]
    },
    get bottomParts () {
      return [
        chromeBottomSizer,
        chromeBottomLeftCornerBottom,
        chromeBottomRightCornerBottom,
        chromeBottomLeftCornerBottomLeft,
        chromeBottomRightCornerBottomRight
      ]
    },
    get topParts () {
      return [
        chromeTopSizer,
        chromeTopLeftCornerTop,
        chromeTopRightCornerTop,
        chromeTopLeftCornerTopLeft,
        chromeTopRightCornerTopRight
      ]
    }
  }

  const bounds = {
    get innerMargin () { return INNER_MARGIN },
    get marginSize () { return MARGIN_SIZE },
    get globalTop () {
      return chromeTopSizer.getGlobalPosition().y + chromeTopSizer.height
    },
    get globalLeft () {
      return chromeLeftSizer.getGlobalPosition().x + chromeLeftSizer.width
    },
    get globalRight () {
      return chromeRightSizer.getGlobalPosition().x
    },
    get globalBottom () {
      return chromeBottomSizer.getGlobalPosition().y
    },
    get rawTop () {
      return chromeTopSizer.y
    },
    get top () {
      return chromeTopSizer.y + MARGIN_SIZE
    },
    get rawLeft () {
      return chromeLeftSizer.x
    },
    get left () {
      return chromeLeftSizer.x + MARGIN_SIZE
    },
    get right () {
      return chromeRightSizer.x
    },
    get bottom () {
      return chromeBottomSizer.y
    },
    get height () {
      const { bottom, top } = this
      const min = Math.min(bottom, top)
      const max = Math.max(bottom, top)
      return max - min
    },
    get width () {
      const { right, left } = this
      const min = Math.min(right, left)
      const max = Math.max(right, left)
      return max - min
    },
    get innerWidth () {
      const { width } = this
      return width
    },
    get mask () {
      const { globalTop, globalLeft, globalRight, globalBottom } = this
      const x = globalLeft + INNER_MARGIN
      const y = globalTop + INNER_MARGIN
      const height = (globalBottom - globalTop) - (INNER_MARGIN * 2)
      const width = (globalRight - globalLeft) - (INNER_MARGIN * 2)
      return { height, width, x, y }
    },
    get maxX () {
      const { width } = this
      return (chromeLeftSizer.x + width) - (INNER_MARGIN * 2)
    },
    get maxY () {
      const { height } = this
      return (chromeTopSizer.y + height) - (INNER_MARGIN * 2)
    },
    get centerX () {
      const { maxX } = this
      return maxX / 2
    },
    get centerY () {
      const { maxY } = this
      return maxY / 2
    }
  }

  const chromePartsArray = [
    chromeMover,
    chromeTopSizer,
    chromeLeftSizer,
    chromeRightSizer,
    chromeBottomSizer,
    chromeTopLeftCornerTop,
    chromeTopLeftCornerLeft,
    chromeTopLeftCornerTopLeft,
    chromeTopRightCornerTop,
    chromeTopRightCornerRight,
    chromeTopRightCornerTopRight,
    chromeBottomLeftCornerLeft,
    chromeBottomLeftCornerBottom,
    chromeBottomLeftCornerBottomLeft,
    chromeBottomRightCornerRight,
    chromeBottomRightCornerBottom,
    chromeBottomRightCornerBottomRight,
    chromeBoxGraphics
  ]

  chromePartsArray.forEach(part => {
    chromeLayer.addChild(part)
    part.on('pointerdown', () => {
      bringToFront()
    })
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

  function notifyMoveListeners () {
    moveListeners.forEach(listener => listener({ ...bounds }))
    emit('parent move', bounds)
    drawMask()
  }

  function drawMask () {
    const { innerMargin, top, left } = bounds
    const { x, y, width, height } = bounds.mask
    const mask = new Graphics()
    mask.beginFill()
    mask.drawRect(x, y, width, height)
    mask.endFill()
    internalContainer.mask = mask
    const boxHeight = Math.max(0, height)
    const boxWidth = Math.max(0, width)
    if (hideBox === false) {
      chromeBoxGraphics.clear()
      if (boxHeight > 0 && boxWidth > 0) {
        chromeBoxGraphics.lineStyle(1, BOX_COLOR, 1.0, 0, true)
        chromeBoxGraphics.drawRect(left + innerMargin, top + innerMargin, Math.max(width, 0), Math.max(height, 0))
      }
    }
  }

  function notifyResizeListeners () {
    const { width, height } = bounds
    resizeListeners.forEach(listener => listener({ width, height, ...bounds }))
    // emit('parent resize', bounds)
    drawMask()
  }

  const moveTo = (x, y) => {
    container.x = x
    container.y = y
    notifyMoveListeners()
  }
  const moveBy = (dx, dy) => {
    container.x += dx
    container.y += dy
    notifyMoveListeners()
  }
  const moveTopEdgeTo = y => {
    const { bottom } = bounds
    const moveValue = y - HALF_MARGIN_SIZE
    const fixedValue = bottom - MARGIN_SIZE - TOOLBOX_MIN_HEIGHT + (MARGIN_SIZE * 2)

    const newY = Math.min(moveValue, fixedValue)

    parts.topParts.map(part => { part.y = newY })

    chromeTopLeftCornerLeft.y = newY + (MARGIN_SIZE)
    chromeTopRightCornerRight.y = newY + (MARGIN_SIZE)

    const { height, top } = bounds

    chromeMover.y = top
    chromeLeftSizer.y = top + (CORNER_SIZE - MARGIN_SIZE)
    chromeRightSizer.y = top + (CORNER_SIZE - MARGIN_SIZE)

    chromeMover.height = height
    chromeLeftSizer.height = height - (CORNER_SIZE * 2) + (MARGIN_SIZE * 2)
    chromeRightSizer.height = height - (CORNER_SIZE * 2) + (MARGIN_SIZE * 2)
  }
  const moveLeftEdgeTo = x => {
    const { right } = bounds
    const moveValue = x - HALF_MARGIN_SIZE
    const fixedValue = right - TOOLBOX_MIN_WIDTH + MARGIN_SIZE
    const newX = Math.min(moveValue, fixedValue)

    parts.leftParts.map(part => { part.x = newX })
    chromeTopLeftCornerTop.x = newX + MARGIN_SIZE
    chromeBottomLeftCornerBottom.x = newX + MARGIN_SIZE

    const { width, left } = bounds

    chromeMover.x = left
    chromeTopSizer.x = left + (CORNER_SIZE - MARGIN_SIZE)
    chromeBottomSizer.x = left + (CORNER_SIZE - MARGIN_SIZE)

    chromeMover.width = width
    chromeTopSizer.width = width - CORNER_SIZE
    chromeBottomSizer.width = width - CORNER_SIZE
  }
  const moveRightEdgeTo = x => {
    const { left } = bounds

    const moveValue = x - HALF_MARGIN_SIZE
    const fixedValue = left + TOOLBOX_MIN_WIDTH - (MARGIN_SIZE * 2)

    const newX = Math.max(moveValue, fixedValue)

    parts.rightParts.map(part => { part.x = newX })
    chromeTopRightCornerTop.x = newX - (CORNER_SIZE - MARGIN_SIZE)
    chromeBottomRightCornerBottom.x = newX - (CORNER_SIZE - MARGIN_SIZE)

    const { width } = bounds

    chromeMover.x = left
    chromeTopSizer.x = left + (CORNER_SIZE - MARGIN_SIZE)
    chromeBottomSizer.x = left + (CORNER_SIZE - MARGIN_SIZE)

    chromeMover.width = width
    chromeTopSizer.width = width - (CORNER_SIZE * 2) + (MARGIN_SIZE * 2)
    chromeBottomSizer.width = width - (CORNER_SIZE * 2) + (MARGIN_SIZE * 2)
  }
  const moveBottomEdgeTo = y => {
    const { top } = bounds
    const moveValue = y - HALF_MARGIN_SIZE
    const fixedValue = top + (TOOLBOX_MIN_HEIGHT - (MARGIN_SIZE * 2))

    const newY = Math.max(moveValue, fixedValue)

    parts.bottomParts.map(part => { part.y = newY })
    chromeBottomLeftCornerLeft.y = newY - (CORNER_SIZE - MARGIN_SIZE)
    chromeBottomRightCornerRight.y = newY - (CORNER_SIZE - MARGIN_SIZE)

    const { height } = bounds

    chromeMover.height = height
    chromeLeftSizer.height = height - CORNER_SIZE
    chromeRightSizer.height = height - CORNER_SIZE

    chromeMover.y = top
    chromeLeftSizer.y = top + (CORNER_SIZE - MARGIN_SIZE)
    chromeRightSizer.y = top + (CORNER_SIZE - MARGIN_SIZE)
  }

  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { y } } }) => {
      moveTopEdgeTo(y)
      notifyResizeListeners()
    })([chromeTopSizer])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { x } } }) => {
      moveLeftEdgeTo(x)
      notifyResizeListeners()
    })([chromeLeftSizer])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { x } } }) => {
      moveRightEdgeTo(x)
      notifyResizeListeners()
    })([chromeRightSizer])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { y } } }) => {
      moveBottomEdgeTo(y)
      notifyResizeListeners()
    })([chromeBottomSizer])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { x, y } } }) => {
      moveTopEdgeTo(y)
      moveLeftEdgeTo(x)
      notifyResizeListeners()
    })(
    [
      chromeTopLeftCornerTop,
      chromeTopLeftCornerLeft,
      chromeTopLeftCornerTopLeft
    ])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { x, y } } }) => {
      moveRightEdgeTo(x)
      moveTopEdgeTo(y)
      notifyResizeListeners()
    })(
    [
      chromeTopRightCornerTop,
      chromeTopRightCornerRight,
      chromeTopRightCornerTopRight
    ])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { x, y } } }) => {
      moveLeftEdgeTo(x)
      moveBottomEdgeTo(y)
      notifyResizeListeners()
    })(
    [
      chromeBottomLeftCornerLeft,
      chromeBottomLeftCornerBottom,
      chromeBottomLeftCornerBottomLeft
    ])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { current: { x, y } } }) => {
      moveRightEdgeTo(x)
      moveBottomEdgeTo(y)
      notifyResizeListeners()
    })(
    [
      chromeBottomRightCornerRight,
      chromeBottomRightCornerBottom,
      chromeBottomRightCornerBottomRight
    ])
  makeBatchEventHandler('dragging')(
    ({ pointerState: { startDelta: { x, y } } }) => {
      moveBy(x, y)
      notifyResizeListeners()
    })([chromeMover])

  chromeMover
    .on('dragstart', () => {
      container.alpha = DRAGGING_ALPHA
    })
    .on('dragend', () => {
      container.alpha = 1
    })

  container.on('redraw mask', () => {
    drawMask()
  })

  container.on('parent move', bounds => {
    emit('parent move', bounds)
    notifyMoveListeners()
  })
  container.on('parent resize', bounds => {
    emit('parent resize', bounds)
    notifyResizeListeners()
  })

  function addChild (...args) {
    internalContainer.addChild(...args)
    return () => {
      removeChild(...args)
    }
  }

  function removeChild (...args) {
    internalContainer.removeChild(...args)
  }

  const clearChildren = () => {
    internalContainer.children.forEach(child => internalContainer.removeChild(child))
  }

  const subscribeToResize = callback => {
    if (resizeListeners.has(callback) === false) {
      resizeListeners.add(callback)
      callback(bounds)
    }
    return () => {
      if (resizeListeners.has(callback)) {
        resizeListeners.delete(callback)
      }
    }
  }

  const subscribeToMove = callback => {
    if (moveListeners.has(callback) === false) {
      moveListeners.add(callback)
      callback(bounds)
    }
    return () => {
      if (moveListeners.has(callback)) {
        moveListeners.delete(callback)
      }
    }
  }

  drawMask()

  return {
    get bounds () { return bounds },
    get width () { return bounds.width },
    set width (newWidth) {
      moveRightEdgeTo(newWidth)
    },
    get height () { return bounds.height },
    set height (newHeight) {
      moveBottomEdgeTo(newHeight)
    },
    moveTo,
    moveBy,
    container,
    sendToBack,
    bringToFront,
    internalContainer,
    addChild,
    removeChild,
    clearChildren,
    subscribeToResize,
    subscribeToMove,
    on,
    emit,
    drawMask
  }
}
