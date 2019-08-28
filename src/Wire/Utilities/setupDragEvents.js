import { makeBigSignal } from './makeBigSignal.js'

export const setupDragEvents = element => {
  const [emitDragMove, dragMove, clearDragMove] = makeBigSignal()
  const [emitDragStart, dragStart, clearDragStart] = makeBigSignal()
  const [emitDragEnd, dragEnd, clearDragEnd] = makeBigSignal()

  let isDragging = false
  let dragOffset = null

  let caughtPointers = new Map()

  let reference = { x: 0, y: 0 }

  const internalDragStart = (event) => {
    const { data } = event
    const { identifier } = data
    dragOffset = event.data.getLocalPosition(element.parent)
    if (caughtPointers.has(identifier) === false) {
      const pointerState = {
        identifier,
        start: {
          x: dragOffset.x,
          y: dragOffset.y
        },
        startDelta: {
          x: 0,
          y: 0
        },
        lastDelta: {
          x: 0,
          y: 0
        },
        current: {
          x: dragOffset.x,
          y: dragOffset.y
        }
      }
      caughtPointers.set(identifier, pointerState)
      emitDragStart({ event, data, pointerState, reference })
    } else {
      console.error('a pointer start should always have a unique identifier.')
    }
    isDragging = caughtPointers.size >= 1
  }

  const internalDragEnd = (event) => {
    const { data } = event
    const { identifier } = data
    if (caughtPointers.has(identifier)) {
      caughtPointers.delete(identifier)
    }
    isDragging = caughtPointers.size >= 1
    emitDragEnd({ event, data, identifier, reference })
  }

  const internalDragMove = (event) => {
    const { data } = event
    const { identifier } = data
    if (isDragging && caughtPointers.has(identifier)) {
      // get existing data
      const existingData = caughtPointers.get(identifier)
      const { start, current } = existingData
      // make an altered version of the data
      const currentPosition = data.getLocalPosition(element.parent)

      reference.x -= current.x - currentPosition.x
      reference.y -= current.y - currentPosition.y

      const changes = {
        startDelta: {
          x: currentPosition.x - start.x,
          y: currentPosition.y - start.y
        },
        lastDelta: {
          x: current.x - currentPosition.x,
          y: current.y - currentPosition.y
        },
        current: {
          x: currentPosition.x,
          y: currentPosition.y
        }
      }
      // replace the existing data with new data
      const pointerState = Object.assign({}, existingData, changes)
      caughtPointers.set(identifier, pointerState)
      emitDragMove({ pointerState, data, event, reference, identifier })
    }
  }

  element.interactive = true
  element.on('pointerdown', internalDragStart)
  element.on('pointermove', internalDragMove)
  element.on('pointerup', internalDragEnd)
  element.on('pointerupoutside', internalDragEnd)

  const destroy = () => {
    clearDragMove()
    clearDragStart()
    clearDragEnd()
  }

  return {
    dragMove,
    dragStart,
    dragEnd,
    destroy
  }
}
