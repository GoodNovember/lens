import { enableDragEvents } from './enableDragEvents.js'
import { makeRect } from './makeRect'
import * as cursors from './cursors.js'
import * as PIXI from 'pixi.js'
import {makeEventForwarder} from './makeEventForwarder.js'

global.PIXI = PIXI
require('pixi-layers')

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

const INNER_MARGIN = 32

const MARGIN_SIZE = 8
const CORNER_SIZE = 16

const HALF_MARGIN_SIZE = MARGIN_SIZE / 2

const CORNER_COLOR = 0x999999 // 0xaaaaaa
const EDGE_COLOR = 0xEEEEEE // 0x999999 // 0xeeeeee
const BG_COLOR = 0xbbbbbb // 0x999999

const DRAGGING_ALPHA = 0.75

const makeBatchEventHandler = eventName => callback => itemArray => itemArray.map(item=>item.on(eventName, callback))

const makeDragRect = makeRectOptions => enableDragEvents(makeRect(makeRectOptions))

export const makeToolbox = ({ width, height }) => {
  const container = new Stage()

  const resizeListeners = new Set()

  const chromeLayer = new Layer()
  container.addChild(chromeLayer)

  const internalPartsLayer = new Layer()
  container.addChild(internalPartsLayer)

  const tellTheKids = makeEventForwarder(internalPartsLayer)

  internalPartsLayer.x = INNER_MARGIN + MARGIN_SIZE
  internalPartsLayer.y = INNER_MARGIN + MARGIN_SIZE

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
        chromeBottomRightCornerBottomRight,
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
    get innerMargin (){ return INNER_MARGIN },
    get marginSize (){ return MARGIN_SIZE },
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
    get top () {
      return chromeTopSizer.y + MARGIN_SIZE
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
      return bottom - top
    },
    get width () {
      const { right, left } = this
      return right - left
    },
    get mask() {
      const { globalTop, globalLeft, globalRight, globalBottom } = this
      const x = globalLeft + INNER_MARGIN
      const y = globalTop + INNER_MARGIN
      const height = (globalBottom - globalTop) - (INNER_MARGIN * 2)
      const width = (globalRight - globalLeft) - (INNER_MARGIN * 2)
      return { height, width, x, y }
    },
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
    chromeBottomRightCornerBottomRight
  ]

  chromePartsArray.forEach(part => chromeLayer.addChild(part))

  const moveTo = (x, y) => {
    container.x = x
    container.y = y
  }
  const moveBy = (dx, dy) => {
    container.x += dx
    container.y += dy
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
    chromeLeftSizer.height = height
    chromeRightSizer.height = height

    chromeMover.y = top
    chromeLeftSizer.y = top + (CORNER_SIZE - MARGIN_SIZE)
    chromeRightSizer.y = top + (CORNER_SIZE - MARGIN_SIZE)
  }

  const drawMask = () => {
    const { x, y, width, height } = bounds.mask
    const mask = new Graphics()
    mask.beginFill()
    mask.drawRect(x, y, width, height)
    mask.endFill()
    internalPartsLayer.mask = mask
  }

  const notifyResizeListeners = () => {
    const { width, height } = bounds
    resizeListeners.forEach(listener => listener({width, height, ...bounds}))
    drawMask()
  }

  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { y } } }) => {
      moveTopEdgeTo(y)
      notifyResizeListeners()
    })([chromeTopSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x } } }) => {
      moveLeftEdgeTo(x)
      notifyResizeListeners()
    })([chromeLeftSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x } } }) => {
      moveRightEdgeTo(x)
      notifyResizeListeners()
    })([chromeRightSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { y } } }) => {
      moveBottomEdgeTo(y)
      notifyResizeListeners()
    })([chromeBottomSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveTopEdgeTo(y)
      moveLeftEdgeTo(x)
      notifyResizeListeners()
    })([
      chromeTopLeftCornerTop,
      chromeTopLeftCornerLeft,
      chromeTopLeftCornerTopLeft
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveRightEdgeTo(x)
      moveTopEdgeTo(y)
      notifyResizeListeners()
    })([
      chromeTopRightCornerTop,
      chromeTopRightCornerRight,
      chromeTopRightCornerTopRight
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveLeftEdgeTo(x)
      moveBottomEdgeTo(y)
      notifyResizeListeners()
    }) ([
      chromeBottomLeftCornerLeft,
      chromeBottomLeftCornerBottom,
      chromeBottomLeftCornerBottomLeft
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveRightEdgeTo(x)
      moveBottomEdgeTo(y)
      notifyResizeListeners()
    }) ([
      chromeBottomRightCornerRight,
      chromeBottomRightCornerBottom,
      chromeBottomRightCornerBottomRight
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { startDelta: { x, y } } }) => {
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

  container.on('parent moved', (payload) => {
    tellTheKids('parent moved', payload)
    drawMask()
  })
  container.on('parent resized', (payload) => {
    tellTheKids('parent resized')(payload)
    drawMask()
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

  const addChild = (...args) => {
    internalPartsLayer.addChild(...args)
  }

  const removeChild = (...args) => {
    internalPartsLayer.removeChild(...args)
  }

  const subscribeToResize = callback => {
    if (resizeListeners.has(callback) === false) {
      resizeListeners.add(callback)
    }
    return () => {
      if (resizeListeners.has(callback)) {
        resizeListeners.delete(callback)
      }
    }
  }

  const emit = (eventName, payload) => {
    tellTheKids(eventName)(payload)
  }

  const on = (eventName, callback) => {
    container.on(eventName, callback)
  }

  drawMask()

  return {
    moveTo,
    moveBy,
    container,
    sendToBack,
    bringToFront,
    internalPartsLayer,
    addChild,
    removeChild,
    subscribeToResize,
    on,
    emit
  }
}
