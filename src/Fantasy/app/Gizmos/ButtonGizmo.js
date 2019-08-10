import {
  // cursors,
  // enableDragEvents
  makeRect,
  ensureDefaults
} from '../utilities'

import {
  Container
} from 'pixi.js'

export class ButtonGizmo {
  constructor (ingredients) {
    const self = this

    const defaults = {
      name: 'unnamed-gizmo',
      x: 0,
      y: 0,
      w: 16,
      h: 16
    }

    const args = ensureDefaults(ingredients, defaults)

    self.container = new Container()

    const rect = makeRect({
      x: args.x,
      y: args.y,
      w: args.w,
      h: args.h,
      tint: 0xff0000
    })

    self.container.addChild(rect)
  }
}
