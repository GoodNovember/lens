export const makeVerletPoint = ({ x: initialX, y: initialY }) => {
  let internalX = initialX
  let internalY = initialY

  const recalculate = () => {

  }

  return {
    get initialX () {
      return initialX
    },
    get initialY () {
      return initialY
    },
    get x () {
      return internalX
    },
    get y () {
      return internalY
    },
    set x (newX) {
      internalX = newX
      recalculate()
    },
    set y (newY) {
      internalY = newY
      recalculate()
    }
  }
}
