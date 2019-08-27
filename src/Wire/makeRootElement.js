import { makeRootUniverse } from './Parts/makeRootUniverse.js'
import { makeToolboxOld } from './Parts/makeToolboxOld.js'

export const makeRootElement = () => {
  const rootUniverse = makeRootUniverse()

  const toolbox = makeToolboxOld({
    name: 'Handy Toolbox',
    x: 0,
    y: 0,
    width: 100,
    height: 256
  })

  rootUniverse.addPart(toolbox)

  return rootUniverse
}
