import { Runner } from 'pixi.js'
export const getDragHooksForSprite = sprite => {
  let isDragging = false
  let startClickPoint = null
  let spriteStart = null

  const dragStarted = new Runner('dragStarted')
  const dragEnded = new Runner('dragEnded')
  const dragMoved = new Runner('dragMoved')

  const fullStop = () => {
    isDragging = false
    startClickPoint = null
    spriteStart = null
    dragEnded.emit()
  }

  sprite.interactive = true
  sprite
    .on('pointerdown', event => {
      isDragging = true
      startClickPoint = event.data.getLocalPosition(sprite.parent)
      spriteStart = {
        x: sprite.x,
        y: sprite.y
      }
      dragStarted.emit()
    })
    .on('pointermove', event => {
      if (isDragging) {
        const {
          x: currentX,
          y: currentY
        } = event.data.getLocalPosition(sprite.parent)
        const dragX = currentX + (spriteStart.x - startClickPoint.x)
        const dragY = currentY + (spriteStart.y - startClickPoint.y)
        dragMoved.emit({
          currentX,
          currentY,
          dragX,
          dragY,
          startClickX: startClickPoint.x,
          startClickY: startClickPoint.y,
          spriteStartX: spriteStart.x,
          spriteStartY: spriteStart.y
        })
      }
    })
    .on('pointerup', fullStop)
    .on('pointerupoutside', fullStop)

  return {
    dragStarted,
    dragEnded,
    dragMoved
  }
}
