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

const CORNER_COLOR = 0x999999 // 0xaaaaaa
const EDGE_COLOR = 0x999999 // 0xeeeeee
const BG_COLOR = 0xbbbbbb // 0x999999
const BOX_COLOR = 0x000000

const DRAGGING_ALPHA = 0.75

const makeBatchEventHandler = eventName => callback => itemArray => itemArray.map(item => item.on(eventName, callback))

const makeDragRect = makeRectOptions => enableDragEvents(makeRect(makeRectOptions))

export const makeToolbox = ({
  x,
  y,
  width,
  height,
  hideBox = false
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
    get cornerSize () { return CORNER_SIZE },
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
      return Math.min(chromeTopSizer.y, chromeBottomSizer.y)
    },
    get top () {
      const { rawTop } = this
      return rawTop
    },
    get rawLeft () {
      return Math.min(chromeLeftSizer.x, chromeRightSizer.x)
    },
    get left () {
      const { rawLeft } = this
      return rawLeft
    },
    get right () {
      return Math.max(chromeLeftSizer.x, chromeRightSizer.x)
    },
    get bottom () {
      return Math.max(chromeTopSizer.y, chromeBottomSizer.y)
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
    const { innerMargin, top, left, marginSize } = bounds
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
        chromeBoxGraphics.drawRect(left + innerMargin + marginSize, top + innerMargin + marginSize, boxWidth, boxHeight)
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
    const { bottom, innerMargin, marginSize, cornerSize } = bounds
    const moveValue = y - (marginSize / 2)
    const fixedValue = bottom - marginSize - TOOLBOX_MIN_HEIGHT + innerMargin

    const newY = Math.min(moveValue, fixedValue)

    parts.topParts.map(part => { part.y = newY })

    chromeTopLeftCornerLeft.y = newY + marginSize
    chromeTopRightCornerRight.y = newY + marginSize

    const { height, top } = bounds

    chromeMover.y = top + marginSize
    chromeLeftSizer.y = top + cornerSize
    chromeRightSizer.y = top + cornerSize

    chromeMover.height = height - marginSize
    chromeLeftSizer.height = height - (cornerSize * 2) + marginSize
    chromeRightSizer.height = height - (cornerSize * 2) + marginSize
  }
  const moveLeftEdgeTo = x => {
    const { right, marginSize, cornerSize } = bounds
    const moveValue = x - (marginSize / 2)
    const fixedValue = right - TOOLBOX_MIN_WIDTH + marginSize
    const newX = Math.min(moveValue, fixedValue)

    parts.leftParts.map(part => { part.x = newX })
    chromeTopLeftCornerTop.x = newX + marginSize
    chromeBottomLeftCornerBottom.x = newX + marginSize

    const { width, left } = bounds

    chromeMover.x = left + marginSize
    chromeTopSizer.x = left + cornerSize
    chromeBottomSizer.x = left + cornerSize

    chromeMover.width = width - marginSize
    chromeTopSizer.width = width - cornerSize - marginSize
    chromeBottomSizer.width = width - cornerSize - marginSize
  }
  const moveRightEdgeTo = x => {
    const { left, marginSize, innerMargin, cornerSize } = bounds

    const moveValue = x - (marginSize / 2)
    const fixedValue = left + TOOLBOX_MIN_WIDTH - innerMargin

    const newX = Math.max(moveValue, fixedValue)

    parts.rightParts.map(part => { part.x = newX })
    chromeTopRightCornerTop.x = newX - (cornerSize - marginSize)
    chromeBottomRightCornerBottom.x = newX - (cornerSize - marginSize)

    const { width } = bounds

    chromeMover.x = left + marginSize
    chromeTopSizer.x = left + cornerSize
    chromeBottomSizer.x = left + cornerSize

    chromeMover.width = width - marginSize
    chromeTopSizer.width = width - (cornerSize * 2) + marginSize
    chromeBottomSizer.width = width - (cornerSize * 2) + marginSize
  }
  const moveBottomEdgeTo = y => {
    const { top, marginSize, innerMargin, cornerSize } = bounds
    const moveValue = y - (marginSize / 2)
    const fixedValue = top + (TOOLBOX_MIN_HEIGHT - innerMargin)

    const newY = Math.max(moveValue, fixedValue)

    parts.bottomParts.map(part => { part.y = newY })
    chromeBottomLeftCornerLeft.y = newY - (cornerSize - marginSize)
    chromeBottomRightCornerRight.y = newY - (cornerSize - marginSize)

    const { height } = bounds

    chromeMover.y = top + marginSize
    chromeLeftSizer.y = top + cornerSize
    chromeRightSizer.y = top + cornerSize

    chromeMover.height = height - marginSize
    chromeLeftSizer.height = height - cornerSize - marginSize
    chromeRightSizer.height = height - cornerSize - marginSize
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
      notifyMoveListeners()
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
