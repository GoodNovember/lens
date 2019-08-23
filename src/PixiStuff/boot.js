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

import { wireRootElement } from './wireRootElement.js'

export const boot = ({ App, subscribeToResize }) => {
  const rootElement = wireRootElement()
  const { stage } = App
  stage.group.enableSort = true
  stage.addChild(rootElement.container)
  subscribeToResize(({ width, height }) => {
    rootElement.setSize({ width, height })
  })
}
