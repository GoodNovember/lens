import { Runner } from 'pixi.js'
export const getDragHooksForSprite = sprite => {
  let isDragging = false

  const dragStarted = new Runner('dragStarted')
  const dragEnded = new Runner('dragEnded')
  const dragMoved = new Runner('dragMoved')

  console.log(sprite)
  sprite.interactive = true
  sprite
    .on('pointerdown', event => {
      isDragging = true
      dragStarted.emit()
    })
    .on('pointerup', event => {
      isDragging = false
      dragEnded.emit()
    })
    .on('pointermove', event => {
      if (isDragging) {
        const {
          x: currentX,
          y: currentY
        } = event.data.getLocalPosition(sprite.parent)
        dragMoved.emit({
          currentX,
          currentY
        })
      }
    })
    .on('pointerupoutside', event => {
      isDragging = false
      dragEnded.emit()
    })

  return {
    dragStarted,
    dragEnded,
    dragMoved
  }
}
