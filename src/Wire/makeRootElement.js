import { makeRootUniverse } from './Parts/makeRootUniverse.js'
import { makeToolboxOld } from './Parts/makeToolboxOld.js'
import { makeToolboxOther } from './Parts/makeToolboxOther.js'

export const makeRootElement = () => {
  const rootUniverse = makeRootUniverse()

  const toolbox = makeToolboxOld({
    name: 'Handy Toolbox',
    x: 0,
    y: 0,
    width: 100,
    height: 256
  })

  // const toolbox = makeToolboxOther({
  //   name: 'Other Toolbox',
  //   x: 0,
  //   y: 0,
  //   width: 400,
  //   height: 200
  // })

  rootUniverse.addPart(toolbox)

  return rootUniverse
}
