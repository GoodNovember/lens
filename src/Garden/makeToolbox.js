import { enableDragEvents } from './enableDragEvents.js'
import { makeRect } from './makeRect'
import * as cursors from './cursors.js'
import * as PIXI from 'pixi.js'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants'

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

const makeDragRect = makeRectOptions => enableDragEvents(makeRect(makeRectOptions))

export const makeToolbox = ({ width, height }) => {
  const container = new Stage()

  const chromeLayer = new Layer()
  container.addChild(chromeLayer)

  // Mover

  const chromeMover = makeDragRect({
    x: MARGIN_SIZE,
    y: MARGIN_SIZE,
    width: width - (MARGIN_SIZE * 2),
    height: height - (MARGIN_SIZE * 2),
    tint: BG_COLOR,
    interactive: true,
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

  const parts = {
    get leftParts () {
      return [
        chromeLeftSizer,
        chromeTopLeftCornerLeft,
        chromeTopLeftCornerTopLeft
      ]
    },
    get rightParts () {
      return [
        chromeRightSizer,
        chromeTopRightCornerRight,
        chromeTopRightCornerTopRight
      ]
    },
    get bottomParts () {
      return [
        chromeBottomSizer
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

  const chromeParts = [
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
    chromeTopRightCornerTopRight

  ]

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

  }

  const moveRightEdgeTo = x => {

  }

  const moveBottomEdgeTo = x => {

  }

  const moveTopLeftHandler = ({ pointerState: { current: { x, y } } }) => {
    moveTopEdgeTo(y)
    moveLeftEdgeTo(x)
  }

  chromeTopLeftCornerTop.on('dragging', moveTopLeftHandler)
  chromeTopLeftCornerLeft.on('dragging', moveTopLeftHandler)
  chromeTopLeftCornerTopLeft.on('dragging', moveTopLeftHandler)

  chromeParts.forEach(part => chromeLayer.addChild(part))

  chromeMover.on('dragging', ({ pointerState: { startDelta: { x, y } } }) => {
    moveBy(x, y)
  }).on('dragstart', () => {
    container.alpha = DRAGGING_ALPHA
  }).on('dragend', () => {
    container.alpha = 1
  })

  chromeTopSizer.on('dragging', ({ pointerState: { current: { y } } }) => {
    moveTopEdgeTo(y)
  })

  chromeLeftSizer.on('dragging', ({ pointerState: { current: { x } } }) => {
    moveLeftEdgeTo(x)
  })

  chromeRightSizer.on('dragging', ({ pointerState: { current: { x } } }) => {
    moveRightEdgeTo(x)
  })

  chromeBottomSizer.on('dragging', ({ pointerState: { current: { y } } }) => {
    moveBottomEdgeTo(y)
  })

  return {
    container
  }
}
