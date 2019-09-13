import { makeToolbox } from './makeToolbox.js'
import { makeUniverse } from './makeUniverse.js'

export const makeUniversalToolbox = ({
  color: strokeStyle = '#eeeeee',
  mode = 'BOTH',
  hideGrid = false,
  hideBox = false,
  ...toolboxParams
}) => {
  const internalToolbox = makeToolbox({
    ...toolboxParams,
    hideBox
  })
  const internalUniverse = makeUniverse({
    color: strokeStyle,
    mode,
    hideGrid
  })
  const on = (eventName, callback) => internalToolbox.on(eventName, callback)
  const emit = (eventName, payload) => internalUniverse.emit(eventName, payload)

  internalToolbox.addChild(internalUniverse.container)
  internalToolbox.subscribeToResize(bounds => {
    const { width, height, top, left, marginSize } = bounds
    internalUniverse.setSize(width, height)
    internalUniverse.container.position.x = left - marginSize
    internalUniverse.container.position.y = top - marginSize
    emit('parent resize', bounds)
  })
  internalToolbox.subscribeToMove(bounds => {
    emit('parent move', bounds)
  })

  const { addChild, removeChild } = internalUniverse

  const clearChildren = () => {
    internalUniverse.clearChildren()
  }
  internalUniverse.on('pointerdown', () => {
    internalToolbox.bringToFront()
  })

  return {
    container: internalToolbox.container,
    toolbox: internalToolbox,
    universe: internalUniverse,
    resetPosition () { internalUniverse.resetPosition() },
    addChild, // overwrites toolbox,
    removeChild, // overwrites toolbox,
    clearChildren, // overwrites toolbox
    emit, // override toolbox,
    on // override toolbox
  }
}
