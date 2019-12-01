import { makeCircle } from '../Utilities/makeCircle.js'
import { hookupPointPhysics } from './engine.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'
import { makeVector } from '../Utilities/makeVector.js'
import { PIXI } from '../Utilities/localPIXI.js'

const { Point } = PIXI

export const makeVerletPoint = ({
  x,
  y,
  iVX = 0,
  iVY = 0,
  isPinned = false,
  hidden = false,
  isDraggable = true
}) => {
  let internalX = x
  let internalY = y
  let internalOldX = x - iVX
  let internalOldY = y - iVY
  let internalIsPinned = !!isPinned || false

  let circle = makeCircle({ x, y, radius: 16, hidden })

  if (isDraggable) {
    circle = enableDragEvents(circle)
  }

  const updateWithVector = vector => {
    internalOldX += vector.x
    internalOldY += vector.y
  }

  const output = {
    circle,
    get isPinned() {
      return internalIsPinned
    },
    set isPinned(value) {
      internalIsPinned = !!value
    },
    get x() {
      return internalX
    },
    set x(newX) {
      circle.x = newX
      internalX = newX
    },
    get y() {
      return internalY
    },
    set y(newY) {
      circle.y = newY
      internalY = newY
    },
    get oldX() {
      return internalOldX
    },
    set oldX(newOldX) {
      internalOldX = newOldX
    },
    get oldY() {
      return internalOldY
    },
    set oldY(newOldY) {
      internalOldY = newOldY
    },
    get vector() {
      const x = internalX - internalOldX
      const y = internalY - internalOldY
      return makeVector({ x, y })
    },
    get point() {
      const x = internalX
      const y = internalX
      return new Point(x, y)
    },
    updateWithVector
  }

  circle.on('dragstart', ({ pointerState }) => {
    const { current } = pointerState
    const { x, y } = current
    internalOldX = x
    internalOldY = y
    output.x = x
    output.y = y
  })

  circle.on('dragging', ({ dx, dy, my, pointerState }) => {
    const { current } = pointerState
    const { x, y } = current
    output.x = x
    output.y = y
  })

  hookupPointPhysics(output)

  return output
}