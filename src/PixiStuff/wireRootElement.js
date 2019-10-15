import { makeRootUniverse } from '../Garden/makeRootUniverse.js'
import { testBed } from '../Wire/testBed.js'
const RootUniverse = makeRootUniverse({
  color: 'darkgray'
})

// const TEST_BED = testBed()

export const wireRootElement = () => {
  const container = RootUniverse.container
  const setSize = ({ width, height }) => RootUniverse.setSize({ width, height })

  testBed(RootUniverse)

  const moveTo = (x, y) => {
    RootUniverse.moveTo(x, y)
  }

  return {
    container,
    setSize,
    moveTo
  }
}
