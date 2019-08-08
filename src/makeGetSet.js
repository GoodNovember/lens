export const makeGetSet = ({ initialValue, skipInitialCall = false }) => {
  let value = initialValue
  let subscribers = new Set()
  const getValue = () => value
  const setValue = newValue => {
    value = newValue
    subscribers.forEach(sub => { sub(newValue) })
  }
  const subscribe = callback => {
    if (subscribers.has(callback) === false) {
      subscribers.add(callback)
      if (skipInitialCall === false) {
        callback(initialValue)
      }
    }
    return () => {
      subscribers.delete(callback)
    }
  }
  return [getValue, setValue, subscribe]
}
