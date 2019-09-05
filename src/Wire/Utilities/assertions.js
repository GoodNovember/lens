export const isObj = test => (!!((test && typeof test === 'object')))
export const isFn = test => ((typeof test === 'function'))
export const isArr = test => (!!(Array.isArray(test)))
export const isNull = test => (typeof test === 'object' && !test)
export const isObject = test => isObj(test)
export const isFunction = test => isFn(test)
export const isArray = test => isArr(test)
export const isUndefined = test => typeof test === 'undefined'
export const isString = test => typeof test === 'string'
export const isSymbol = test => typeof test === 'symbol'
export const isNumber = test => typeof test === 'number'
export const isBoolean = test => typeof test === 'boolean'
export const isBool = test => isBoolean(test)

export const someAreTrue = (...tests) => tests.reduce((acc, test) => {
  if (!acc) {
    if (isFunction(test)) {
      acc = test()
    } else if (isBoolean(test)) {
      acc = test
    } else {
      console.log('someAreTrue: Found a non boolean or function value:', test)
      acc = false
    }
  }
  return acc
}, false)

export const allAreTrue = (...tests) => tests.reduce((acc, test) => {
  if (acc) {
    if (isFunction(test)) {
      acc = test()
    } else if (isBoolean(test)) {
      acc = test
    } else {
      console.log('allAreTrue: Found a non boolean or function value:', test)
      acc = false
    }
  }
  return acc
}, true)

export const allAreFalse = (...tests) => (someAreTrue(...tests) === false)

export const doWhenTrue = callback => test => {
  if (test) {
    if (isFunction(callback)) {
      return callback()
    }
  }
}

export const doWhenFalse = callback => test => {
  if (!test) {
    if (isFunction(callback)) {
      return callback()
    }
  }
}
