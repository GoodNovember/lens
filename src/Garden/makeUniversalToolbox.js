import { makeToolbox } from './makeToolbox.js'
import { makeUniverse } from './makeUniverse.js'

export const makeUniversalToolbox = ({
  color: strokeStyle = '#eeeeee',
  mode = 'BOTH',
  ...toolboxParams
}) => {
  const internalToolbox = makeToolbox({ ...toolboxParams })
  const internalUniverse = makeUniverse({
    color: strokeStyle,
    mode
  })

  const on = (eventName, callback) => internalToolbox.on(eventName, callback)
  const emit = (eventName, payload) => internalUniverse.emit(eventName, payload)

  internalToolbox.addChild(internalUniverse.container)
  internalToolbox.subscribeToResize(({ width, height, top, left, marginSize }) => {
    internalUniverse.setSize(width, height)
    internalUniverse.container.position.x = left - marginSize
    internalUniverse.container.position.y = top - marginSize
    emit('parent resize', { width, height })
  })

  const { addChild, removeChild } = internalUniverse

  const clearChildren = () => {
    internalUniverse.clearChildren()
  }
  internalUniverse.on('pointerdown', () => {
    internalToolbox.bringToFront()
  })

  return {
    ...internalToolbox,
    resetPosition () { internalUniverse.resetPosition() },
    addChild, // overwrites toolbox,
    removeChild, // overwrites toolbox,
    clearChildren, // overwrites toolbox
    emit, // override toolbox,
    on // override toolbox
  }
}
