export const makeCrystalShard = ({ validate = () => true, initialValue = null }) => {
  let value = initialValue
  const subscriptionCallbacks = new Set()
  const getValue = () => value
  const setValue = newValue => {
    if (validate(newValue)) {
      value = newValue
      subscriptionCallbacks.forEach(callback => {
        callback(newValue)
      })
    } else {
      console.error('Validation Failed', newValue)
    }
  }
  const { shard } =
  {
    get shard () { return getValue() },
    set shard (value) { setValue(value) }
  }
  const subscribe = (callback) => {
    if (typeof callback === 'function') {
      if (subscriptionCallbacks.has(callback) === false) {
        subscriptionCallbacks.add(callback)
      }
    }
  }
  return { shard, subscribe }
}
