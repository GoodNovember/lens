import { PIXI } from '../Utilities/localPixi.js'

const { display: { Stage } } = PIXI

export const makeGenericItem = (name) => {
  let activeParent = null

  const container = new Stage()
  const internalContainer = new Stage()
  const activeChildren = new Set()
  const activeInternalParts = new Set()

  console.log(`Made [${name}].`)

  const publicInterface = {
    name,
    setParent,
    getParent () { return activeParent },
    container,
    internalContainer,
    addPart,
    removePart,
    getChildren,
    bridgeEvents
  }

  function getChildren () {
    return Array.from(activeChildren.values())
  }

  function bridgeEvent (eventName) {
    const callback = (...args) => {
      internalContainer.children.forEach(child => {
        child.emit(eventName, ...args)
      })
    }
    container.on(eventName, callback)
    return () => {
      container.off(eventName, callback)
    }
  }

  function bridgeEvents (eventNameArray = []) {
    const bridgedEventDestroyers = eventNameArray.map(eventName => bridgeEvent(eventName))
    return () => {
      bridgedEventDestroyers.forEach(destroy => { destroy() })
    }
  }

  function setParent (parent) {
    if (activeParent) {
      console.log(`Removing ${name} from parent: ${parent.name}`)
      if (typeof activeParent.removeChild === 'function') {
        activeParent.removeChild(publicInterface)
      }
    }
    console.log(`Setting ${name}'s parent to ${parent.name}`)
    activeParent = parent
  }

  function addPart (part) {
    if (activeChildren.has(part) === false) {
      activeChildren.add(part)
      console.log(`Put [${part.name}] inside [${name}].`)
      if (part.container) {
        if (activeInternalParts.has(part.container) === false) {
          activeInternalParts.add(part.container)
          internalContainer.addChild(part.container)
        }
      }
    }
    return () => { removePart(part) }
  }

  function removePart (part) {
    if (activeChildren.has(part)) {
      activeChildren.delete(part)
      if (part.container) {
        if (activeInternalParts.has(part.container)) {
          activeInternalParts.delete(part.container)
          internalContainer.removeChild(part.container)
        }
      }
      if (part.parent) {
        part.parent = null
      }
    }
  }

  return publicInterface
}
