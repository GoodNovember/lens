import { makeRootUniverse } from '../Garden/makeRootUniverse.js'
import { testBed } from '../Wire/testBed.js'
const RootUniverse = makeRootUniverse({
  color: 'darkgray'
})

const TEST_BED = testBed()

export const wireRootElement = () => {
  const container = RootUniverse.container
  const setSize = ({ width, height }) => RootUniverse.setSize({ width, height })

  RootUniverse.addChild(TEST_BED.container)

  return {
    container,
    setSize
  }
}
