const add = ({ left, right }) => left + right
const subtract = ({ left, right }) => left - right
const multiply = ({ left, right }) => left * right
const divide = ({ dividend, divisor }) => {
  const quotent = dividend / divisor
  const remainder = dividend % divisor
  return { quotent, remainder }
}

const theOppositeOf = test => !test
const isString = test => typeof test === 'string'
const isNull = test => test === null
const isFunction = test => typeof test === 'function'
const isObject = test => ((typeof test === 'object') && (theOppositeOf(isNull(test))))
const isArray = test => Array.isArray(test)

const hasCallableMethod = ({ target, method }) => {
  if (isObject(target)) {
    if (isString(method)) {
      if (isFunction(target[method])) {
        return true
      }
    }
  }
  return false
}

const deferredAgent = ({ target, method, args = [], callback }) => () => {
  if (hasCallableMethod({ target, method })) {
    if (isArray(args)) {
      const result = target[method](...args)
      if (isFunction(callback)) {
        callback(result)
        return null
      } else {
        return result
      }
    } else {
      const result = target[method](args)
      if (isFunction(callback)) {
        callback(result)
        return null
      } else {
        return result
      }
    }
  } else {
    console.error({ target, method, args })
  }
}

let isWorking = false
const internalStack = []

const defer = ({ target, method, args = [], callback }) => {
  internalStack.push(
    deferredAgent({
      target,
      method,
      args,
      callback (value) {
        isWorking = false
        if (isFunction(callback)) {
          callback(value)
        }
        if (internalStack.length > 0) {
          const nextAgent = internalStack.pop()
          if (isFunction(nextAgent)) {
            setTimeout(() => {
              nextAgent()
            }, 0)
          }
        }
      }
    })
  )
  if (isWorking === false) {
    isWorking = true
    setTimeout(() => {
      if (internalStack.length > 0) {
        const nextAgent = internalStack.pop()
        if (isFunction(nextAgent)) {
          nextAgent()
        }
      }
    }, 0)
  }
}

defer({
  target: document,
  method: 'createElement',
  args: ['canvas'],
  callback (canvas) {
    console.log('CANVAS1', canvas)
  }
})
