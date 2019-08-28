export const makeBigSignal = () => {
  const listeners = new Set()
  const emit = payload => {
    for (const listener of listeners) {
      listener(payload)
    }
  }
  const subscribe = callback => {
    if (listeners.has(callback) === false) {
      if (typeof callback === 'function') {
        listeners.add(callback)
      } else {
        console.error('Big Signal Error: Callback not a function', callback)
      }
    }
    return () => {
      if (listeners.has(callback)) {
        listeners.delete(callback)
      } else {
        console.error('Big Signal Error: Already unsubscribed.')
      }
    }
  }
  const clear = () => {
    if (listeners.size() > 0) {
      listeners.clear()
    }
  }
  return [ emit, subscribe, clear ]
}
