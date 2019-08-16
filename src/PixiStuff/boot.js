import { makeRootUniverse } from '../Garden/makeRootUniverse.js'
import { makeToolbox } from '../Garden/makeToolbox.js'

const RootUniverse = makeRootUniverse({
  color: 'white'
})

const funnyToolbox = makeToolbox({
  width: 300,
  height: 200,
  x: 25,
  y: 30
})

export const boot = ({ App, subscribeToResize }) => {
  const { stage } = App
  stage.group.enableSort = true
  stage.addChild(RootUniverse.container)
  subscribeToResize(({ width, height }) => {
    RootUniverse.setSize({ width, height })
  })

  RootUniverse.addChild(funnyToolbox.container)
}
