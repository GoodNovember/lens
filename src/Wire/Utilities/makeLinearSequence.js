export const makeLinearSequence = ({ sequenceArray, success }) => {
  let currentIndex = 0
  let previousPayload = null
  const successRequired = sequenceArray.length
  const advance = () => {
    if (currentIndex < successRequired) {
      currentIndex++
    } else {
      success()
    }
  }
  const retreat = () => {
    if (currentIndex - 1 >= 0) {
      currentIndex--
    }
  }
  const reset = () => {
    previousPayload = null
    currentIndex = 0
  }
  const dispatch = (payload) => {
    const currentTest = sequenceArray[currentIndex]
    if (typeof currentTest === 'function') {
      currentTest({
        payload,
        previousPayload,
        advance,
        retreat,
        reset
      })
    }
  }
  return [dispatch]
}