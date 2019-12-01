export const makeVector = ({ x, y }) => {

  let internalX = x
  let internalY = y
  const clone = () => {
    return makeVector({ x: internalX, y: internalY })
  }

  const add = (otherVector) => {
    const output = clone()
    output.x += otherVector.x
    output.y += otherVector.y
    return output
  }

  const subtract = (otherVector) => {
    const output = clone()
    output.x -= otherVector.x
    output.y -= otherVector.y
    return output
  }

  const divide = (value) => {
    const output = clone()
    output.x /= value
    output.y /= value
    return output
  }

  const multiply = (value) => {
    const output = clone()
    output.x *= value
    output.y *= value
    return output
  }

  const addTo = (otherVector) => {
    internalX += otherVector.x
    internalY += otherVector.y
  }

  const subtractFrom = (otherVector) => {
    internalX -= otherVector.x
    internalY -= otherVector.y
  }

  const multiplyBy = value => {
    internalX *= value
    internalY *= value
  }

  const divideBy = value => {
    internalX /= value
    internalY /= value
  }

  const output = {
    clone,
    get x() {
      return internalX
    },
    set x(newX) {
      internalX = newX
    },
    get y() {
      return internalY
    },
    set y(newY) {
      internalY = newY
    },
    get length() {
      const { x, y } = output
      return Math.sqrt((x * x) + (y * y))
    },
    set length(newLength) {
      const { angle } = output
      internalX = Math.cos(angle) * newLength
      internalY = Math.sin(angle) * newLength
    },
    get angle() {
      return Math.atan2(internalY, internalX)
    },
    set angle(newAngle) {
      const { length } = output
      internalX = Math.cos(newAngle) * length;
      internalY = Math.sin(newAngle) * length;
    },
    add,
    addTo,
    subtract,
    subtractFrom,
    multiply,
    multiplyBy,
    divide,
    divideBy
  }

  return output
}