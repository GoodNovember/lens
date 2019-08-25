import { makeToolbox } from './makeToolbox.js'
import { makeUniverse } from './makeUniverse.js'
import { removeAllChildrenFromContainer } from './utilities.js'

export const makeUniversalToolbox = ({
  color: strokeStyle = '#eeeeee',
  ...toolboxParams
}) => {
  const internalToolbox = makeToolbox({ ...toolboxParams })
  const internalUniverse = makeUniverse({
    color: strokeStyle
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

  const addChild = (...props) => internalUniverse.addChild(...props)
  const removeChild = (...props) => internalUniverse.removeChild(...props)
  const clearChildren = () => internalUniverse.clearChildren()

  internalUniverse.on('pointerdown', () => {
    internalToolbox.bringToFront()
  })

  return {
    ...internalToolbox,
    addChild, // overwrites toolbox,
    removeChild, // overwrites toolbox,
    clearChildren, // overwrites toolbox
    emit, // override toolbox,
    on // override toolbox
  }
}
