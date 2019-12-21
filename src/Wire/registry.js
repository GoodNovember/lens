import genericParts from './Parts'
import noiseParts from './Noises'

import { batchConnect as importedBatchConnect } from './Utilities/universalJackConnectionNetwork.js'

const partsMaps = [
  genericParts,
  noiseParts
]

const masterRegistry = new Map()

for (const partsMap of partsMaps) {
  const keys = Object.keys(partsMap)
  for (const key of keys) {
    const lowKey = key.toLowerCase()
    if (masterRegistry.has(lowKey) === false) {
      masterRegistry.set(lowKey, partsMap[key])
    } else {
      console.error('Duplicate Found:', lowKey)
    }
  }
}

export const canMake = ({ thing }) => {
  const lowKey = thing.toLowerCase()
  return masterRegistry.has(`make${lowKey}`)
}

export const make = ({ thing, ingredients }) => {
  const lowKey = thing.toLowerCase()
  if (canMake({ thing })) {
    const maker = masterRegistry.get(`make${lowKey}`)
    return Promise.resolve(maker(ingredients))
  } else {
    return Promise.reject(new Error(`Cannot Make ${thing}`))
  }
}

export const batchMake = ({
  thingsToMake,
  universe
}) => {
  return Promise.all(thingsToMake.map(({ thing, ingredients }) => {
    return make({ thing, ingredients: { ...ingredients, universe } })
  }))
}

export const batchConnect = (arrayOfConnectionIDs) => {
  return importedBatchConnect(arrayOfConnectionIDs)
}

export const getMakableThings = () => {
  const output = []
  for (const [thing, maker] of masterRegistry) {
    output.push({ thing, maker })
  }
  return output
}
