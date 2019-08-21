import { makeRootUniverse } from '../Garden/makeRootUniverse.js'
import { makeToolbox } from '../Garden/makeToolbox.js'
import { makeUniversalToolbox } from '../Garden/makeUniversalToolbox.js'
// import { makeUniverse } from '../Garden/makeUniverse.js'

const RootUniverse = makeRootUniverse({
  color: 'white'
})

const sternToolbox = makeToolbox({
  height: 50,
  width: 45,
  x: 16,
  y: 16
})

const uni = makeUniversalToolbox({
  width: 225,
  height: 333
})

const uni2 = makeUniversalToolbox({
  width: 300,
  height: 400,
  x: 100,
  y: 100
})

export const boot = ({ App, subscribeToResize }) => {
  const { stage } = App
  stage.group.enableSort = true
  stage.addChild(RootUniverse.container)
  subscribeToResize(({ width, height }) => {
    RootUniverse.setSize({ width, height })
  })
  RootUniverse.addChild(uni.container)
  RootUniverse.addChild(uni2.container)
  uni.addChild(sternToolbox.container)
}
