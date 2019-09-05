import { isObject } from './assertions.js'

const extend = (defaults) => (anotherObject) => {
  if (isObject(defaults) && isObject(anotherObject)) {
    return Object.assign({}, defaults, anotherObject)
  } else {
    if (isObject(defaults) === false) {
      console.error('Default object is not an object.', defaults)
    } else if (isObject(anotherObject) === false) {
      console.error('Other object is not an object', anotherObject)
    }
  }
}

export const ensureDefaults = (ingredients, defaults) => ((isObject(ingredients)) ? (extend(defaults)(ingredients)) : (defaults))
