import { ensureDefaults } from '../utilities'

export const enableDragEvents = (something, options) => {
  let isDragging = false
  let dragOffset = null

  let caughtPointers = new Map()

  const defaults = {
    reference: { x: 0, y: 0 },
    target: null
  }

  const args = ensureDefaults(options, defaults)

  let reference = args.reference

  const internalDragStart = (event) => {
    const { data } = event
    const { identifier } = data
    dragOffset = event.data.getLocalPosition(args.target ? args.target : something.parent)
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
      something.emit('dragstart', { event, data, pointerState, reference })
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
    something.emit('dragend', { event, identifier, data, reference })
  }

  const internalDragMove = (event) => {
    const { data } = event
    const { identifier } = data
    if (isDragging && caughtPointers.has(identifier)) {
      // get existing data
      const existingData = caughtPointers.get(identifier)
      const { start, current } = existingData
      // make an altered version of the data
      const currentPosition = data.getLocalPosition(args.target ? args.target : something.parent)

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
      something.emit('dragging', { pointerState, data, event, reference })
    }
  }

  something.interactive = true
  something
    .on('pointerdown', internalDragStart)
    .on('pointerup', internalDragEnd)
    .on('pointerupoutside', internalDragEnd)
    .on('pointermove', internalDragMove)

  return something
}
