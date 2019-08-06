export const isObj = (test) => ( (test && typeof test === 'object') ? (true) : (false) )
export const isFn = (test) => ( (typeof test === 'function') ? (true) : (false) )
export const isArr = (test) => ((Array.isArray(test)) ? (true) : (false))