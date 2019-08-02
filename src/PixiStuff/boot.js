// import * as PIXI from 'pixi.js'
import { makeSimpleSprite } from './makeSimpleSprite'
import { getDragHooksForSprite } from './getDragHooksForSprite'

export const boot = ({ App }) => {
  const regularSprite = makeSimpleSprite()

  regularSprite.width = 100
  regularSprite.height = 100

  App.stage.addChild(regularSprite)

  const {
    dragStarted,
    dragEnded,
    dragMoved
  } = getDragHooksForSprite(regularSprite)

  dragStarted.add({
    dragStarted () {
      regularSprite.alpha = 0.5
    }
  })

  dragMoved.add({
    dragMoved (data) {
      const {
        dragX,
        dragY
      } = data
      regularSprite.x = dragX
      regularSprite.y = dragY
    }
  })

  dragEnded.add({
    dragEnded () {
      regularSprite.alpha = 1.0
    }
  })
}
