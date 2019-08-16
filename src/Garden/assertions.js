export const isObj = (test) => (!!((test && typeof test === 'object')))
export const isFn = (test) => ((typeof test === 'function'))
export const isArr = (test) => (!!(Array.isArray(test)))
