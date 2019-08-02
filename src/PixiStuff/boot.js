// import * as PIXI from 'pixi.js'
import { makeSimpleSprite } from './makeSimpleSprite'
import { getDragHooksForSprite } from './getDragHooksForSprite'

export const boot = ({ App, view }) => {
  const regularSprite = makeSimpleSprite()
  regularSprite.width = 100
  regularSprite.height = 100
  const {
    dragStarted,
    dragEnded,
    dragMoved
  } = getDragHooksForSprite(regularSprite)
  App.stage.addChild(regularSprite)

  dragStarted.add({
    dragStarted () {
      regularSprite.alpha = 0.5
    }
  })
  dragMoved.add({
    dragMoved (data) {
      const { currentX, currentY } = data
      regularSprite.x = currentX
      regularSprite.y = currentY
    }
  })
  dragEnded.add({
    dragEnded () {
      regularSprite.alpha = 1.0
    }
  })
}
