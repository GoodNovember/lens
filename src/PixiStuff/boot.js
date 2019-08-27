// import { fantasyRootContainer } from './fantasyRootContainer.js'

// export const boot = ({ App, subscribeToResize }) => {
//   const FantasyElement = fantasyRootContainer()
//   const { stage } = App
//   stage.group.enableSort = true
//   stage.addChild(FantasyElement.container)
//   subscribeToResize(({ width, height }) => {
//     FantasyElement.setSize({ width, height })
//   })
// }

// import { wireRootElement } from '../Wire/wireRootElement.js'

// export const boot = ({ App, subscribeToResize, subscribeToImpetus }) => {
//   const rootElement = wireRootElement()
//   const { stage } = App
//   stage.group.enableSort = true
//   stage.addChild(rootElement.container)
//   subscribeToResize(({ width, height }) => {
//     rootElement.setSize({ width, height })
//   })
//   // subscribeToImpetus(({ x, y }) => {
//   //   rootElement.moveTo(x, y)
//   // })
// }

import { makeRootElement } from '../Wire/makeRootElement.js'

export const boot = ({ App, subscribeToResize }) => {
  const rootElement = makeRootElement()

  const { stage } = App

  stage.group.enableSort = true
  stage.addChild(rootElement.container)

  rootElement.parent = stage

  subscribeToResize(({ width, height }) => {
    rootElement.resizeTo({ width, height })
  })
}
