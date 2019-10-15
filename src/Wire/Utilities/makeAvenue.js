export const makeAvenue = ({
  expectedSequence = [],
  includeIncrementalSuccesses = false,
  successCallback = () => null,
  failureCallback = () => null,
}) => {
  let successCount = 0
  let currentIndex = 0
  let isEnabled = true
  let prevPayload = null

  const successThreshhold = expectedSequence.length

  const increment = () => {
    successCount++
    currentIndex++
  }

  const reset = () => {
    successCount = 0
    currentIndex = 0
    prevPayload = null
  }

  const isSuccess = (payload) => {
    const currentTest = expectedSequence[currentIndex]
    let verdict = false
    if (typeof currentTest === 'function') {
      if (prevPayload) {
        verdict = !!currentTest({ prevPayload, payload })
      } else {
        verdict = !!currentTest({ payload, prevPayload: null })
      }
    }
    prevPayload = payload
    return verdict
  }

  const isUltimateSuccess = () => successCount >= successThreshhold

  const dispatch = (payload) => {
    if (isEnabled) {
      if (isSuccess(payload)) {
        increment()
        if (isUltimateSuccess()) {
          successCallback({
            current: successCount,
            required: successThreshhold,
            isComplete: true
          })
          reset()
        } else if (includeIncrementalSuccesses) {
          successCallback({
            current: successCount,
            required: successThreshhold,
            isComplete: false
          })
        }
      } else {
        failureCallback()
        reset()
      }
    }
  }

  return {
    dispatch
  }
}