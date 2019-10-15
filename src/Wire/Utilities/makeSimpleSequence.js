export const makeSimpleSequence = (sequenceArray) => {
  let currentIndex = 0
  let currentSuccesses = 0
  const requiredSuccesses = sequenceArray.length
  const advance = () => {
    currentSuccesses++
    if (currentSuccesses === requiredSuccesses) {
      return true
    } else {
      return false
    }
  }
  const reset = () => {
    currentIndex = 0
    currentSuccesses = 0
  }
  return testString => {
    const activeItem = sequenceArray[currentIndex]
    if (typeof activeItem === 'string') {
      if (testString === activeItem) {
        return advance()
      } else {
        reset()
        return false
      }
    } else if (Array.isArray(activeItem) === true) {
      const index = activeItem.indexOf(testString)
      if (index >= 0) {
        return advance()
      } else {
        reset()
        return false
      }
    }
    return false
  }
}