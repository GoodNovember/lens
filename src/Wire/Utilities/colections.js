export const collection = inputSet => {
  return {
    union (otherSet) {
      const mySetClone = new Set([...inputSet])
      const otherSetClone = new Set([...otherSet])
      return new Set([...mySetClone, ...otherSetClone])
    },
    difference (otherSet) {
      const mySetClone = new Set([...inputSet])
      const otherSetClone = new Set([...otherSet])
      return new Set(mySetClone.filter(item => otherSetClone.has(item) === false))
    },
    intersection (otherSet) {
      const mySetClone = new Set([...inputSet])
      const otherSetClone = new Set([...otherSet])
      return new Set(mySetClone.filter(item => otherSetClone.has(item) === true))
    },
    map (callback) {
      const mySetClone = new Set([...inputSet])
      return new Set([...mySetClone].map(callback))
    },
    filter (callback) {
      const mySetClone = new Set([...inputSet])
      return new Set([...mySetClone].filter(callback))
    },
    ...inputSet
  }
}
