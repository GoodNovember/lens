import { makeCircle } from '../Utilities/makeCircle.js'
import { hookupPointPhysics } from './engine.js'

export const makeVerletPoint = ({
  x,
  y,
  iVX = 0,
  iVY = 0,
  isPinned = false,
  hidden = false,
}) => {
  let internalX = x
  let internalY = y
  let internalOldX = x - iVX
  let internalOldY = y - iVY
  let internalIsPinned = !!isPinned || false

  const circle = makeCircle({ x, y, radius: 16, hidden })

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
    }
  }

  hookupPointPhysics(output)

  return output
}