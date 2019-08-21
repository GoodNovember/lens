import { makeToolbox } from './makeToolbox.js'
import { makeUniverse } from './makeUniverse.js'

export const makeUniversalToolbox = ({
  ...toolboxParams
}) => {
  const internalToolbox = makeToolbox({ ...toolboxParams })
  const internalUniverse = makeUniverse({})

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

  return {
    ...internalToolbox,
    addChild, // overwrites toolbox,
    removeChild, // overwrites toolbox,
    emit, // override toolbox,
    on // override toolbox
  }
}
