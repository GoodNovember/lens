import { enableDragEvents } from './enableDragEvents.js'
import { makeRect } from './makeRect'
import * as cursors from './cursors.js'
import * as PIXI from 'pixi.js'

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

  const chromeLayer = new Layer()
  container.addChild(chromeLayer)

  const internalPartsLayer = new Layer()
  container.addChild(internalPartsLayer)

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
    get maskBounds () {
      const { top, left, right, bottom } = this
      const topLeftPoint = {
        x: left,
        y: top
      }
      const topRightPoint = {
        x: right,
        y: top
      }
      const bottomLeftPoint = {
        x: left,
        y: bottom
      }
      const bottomRightPoint = {
        x: right,
        y: bottom
      }
      return {
        topLeftPoint,
        topRightPoint,
        bottomLeftPoint,
        bottomRightPoint
      }
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

  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { y } } }) => {
      moveTopEdgeTo(y)
    })([chromeTopSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x } } }) => {
      moveLeftEdgeTo(x)
    })([chromeLeftSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x } } }) => {
      moveRightEdgeTo(x)
    })([chromeRightSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { y } } }) => {
      moveBottomEdgeTo(y)
    })([chromeBottomSizer])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveTopEdgeTo(y)
      moveLeftEdgeTo(x)
    })([
      chromeTopLeftCornerTop,
      chromeTopLeftCornerLeft,
      chromeTopLeftCornerTopLeft
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveRightEdgeTo(x)
      moveTopEdgeTo(y)
    })([
      chromeTopRightCornerTop,
      chromeTopRightCornerRight,
      chromeTopRightCornerTopRight
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveLeftEdgeTo(x)
      moveBottomEdgeTo(y)
    }) ([
      chromeBottomLeftCornerLeft,
      chromeBottomLeftCornerBottom,
      chromeBottomLeftCornerBottomLeft
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { current: { x, y } } }) => {
      moveRightEdgeTo(x)
      moveBottomEdgeTo(y)
    }) ([
      chromeBottomRightCornerRight,
      chromeBottomRightCornerBottom,
      chromeBottomRightCornerBottomRight
    ])
  makeBatchEventHandler('dragging')
    (({ pointerState: { startDelta: { x, y } } }) => {
      moveBy(x,y)
    })([chromeMover])
  
  chromeMover
    .on('dragstart', () => {
      container.alpha = DRAGGING_ALPHA
    })
    .on('dragend', () => {
      container.alpha = 1
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

  return {
    moveTo,
    moveBy,
    container,
    sendToBack,
    bringToFront,
    internalPartsLayer
  }
}
