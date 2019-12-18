import { PIXI } from '../Utilities/localPIXI.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'
import { makeRect } from '../Utilities/makeRect.js'
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

  const output = {
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
    }
  }

  function moveTo (x, y) {
    container.x = x
    container.y = y
    internalX = x
    internalY = y
  }

  function moveBy (x, y) {
    container.x += x
    container.y += y
    internalX += x
    internalY += y
  }

  return output
}
