// import * as PIXI from 'pixi.js'
// import { createSizer } from './createSizer.js'
// import * as PIXI from 'pixi.js'
// import 'pixi-layers'

import { Universe } from '../Fantasy/app'

const U = new Universe({
  children: [
    {
      kind: 'Toolbox',
      x: 100,
      y: 100,
      w: 500,
      h: 300,
      children: [
        {
          kind: 'Universe',
          x: 100,
          y: 100
        }
      ]
    }
  ]
})

export const boot = ({ App }) => {
  const { stage } = App
  stage.group.enableSort = true
  stage.addChild(U.container)
}
