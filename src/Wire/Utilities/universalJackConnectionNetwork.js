import { PIXI } from './localPIXI.js'

import StateMachine from 'javascript-state-machine'

const {
  Texture,
  Sprite,
  display,
  SimpleRope
} = PIXI

// states
/**
 * initial (I exist)
 * disconnected (I await something, I am not connected)
 * connected (I am connected to another jack)
 * connected-clicked (while I am connected, I was also clicked)
 * disconnected-clicked (Oh, I was clicked!)
 * connected/disconnected-(clicked)-drag (Ah, I am part of a drag)
 * draged-enter (The pointer is dragging and I have been entered)
 * drag-released-on-disconnected-jack
 * drag-released-on-connected-jack
 * drag-released-on-nothing
 */

const { Layer, Stage } = display
const registeredJacks = new Map()

const RootWireLayer = new Layer()
RootWireLayer.interactive = true

const pointerDownJacks = new Map()

const globalConnectionMap = new Map()

const handleJackPointerMove = ({ event, jack }) => {

}

export const getRootWireLayer = ({ pointerMoveTarget }) => {
  if (pointerMoveTarget) {
    pointerMoveTarget.on('pointermove', event => {
      if (pointerDownJacks.size > 0) {
        if (pointerDownJacks.has(event.data.identifier)) {
          const jack = pointerDownJacks.get(event.data.identifier)
          handleJackPointerMove({ event, jack })
        }
      }
    })
  }
  return RootWireLayer
}

const draggingJacks = new Set()
const draggingPointers = new Set()
let currentDragTarget = null

const isOrStartsWith = ({
  is,
  startsWith
}) => test => {
  if (test === is) {
    return true
  } else {
    if (typeof test === 'string') {
      return test.startsWith(startsWith)
    } else {
      return false
    }
  }
}

const normalizedCoupleName = ({ sourceJack, targetJack }) => {
  const isInput = isOrStartsWith({
    is: 'input',
    startsWith: 'input-'
  })

  const isOutput = isOrStartsWith({
    is: 'output',
    startsWith: 'output-'
  })

  if (isInput(sourceJack.kind) && isOutput(targetJack.kind)) {
    return (`${targetJack.name} -> ${sourceJack.name}`).toLowerCase()
  }
  if (isOutput(sourceJack.kind) && isInput(targetJack.kind)) {
    return (`${sourceJack.name} -> ${targetJack.name}`).toLowerCase()
  } else {
    return (`${sourceJack.name} -> ${targetJack.name}`).toLowerCase()
  }
}

const disconnectJacks = ({ sourceJack, targetJack }) => {
  const connectionID = normalizedCoupleName({ sourceJack, targetJack })
  if (globalConnectionMap.has(connectionID)) {
    const { disconnect } = globalConnectionMap.get(connectionID)
    console.log('disconnect', connectionID)
    disconnect()
    globalConnectionMap.delete(connectionID)
  }
}

const connectJacks = ({ sourceJack, targetJack }) => {
  const connectionID = normalizedCoupleName({ sourceJack, targetJack })
  if (globalConnectionMap.has(connectionID)) {
    disconnectJacks({ sourceJack, targetJack })
  } else {
    if (sourceJack.isConnectedTo({ jack: targetJack }) === false) {
      const disconnect = sourceJack.connectTo({ jack: targetJack })
      console.log('connect', connectionID)
      globalConnectionMap.set(connectionID, { disconnect, sourceJack, targetJack })
    }
  }
}

export const registerJackOnNetwork = ({ jack }) => {
  const { name, sprite, container, stateMachine } = jack

  container.on('jack-awaken', ({ event }) => {
    const { data: { identifier } } = event
    if (draggingPointers.has(identifier)) {
      currentDragTarget = jack
    }
  })
  container.on('jack-nap', ({ event }) => {
    const { data: { identifier } } = event
    // console.log('NAP', { event })
    if (draggingPointers.has(identifier)) {
      currentDragTarget = null
    }
  })
  container.on('jack-drag-start', ({ event }) => {
    const { data: { identifier } } = event
    // console.log('DRAG-START', { event })
    if (draggingJacks.has(jack) === false) {
      draggingJacks.add(jack)
      draggingPointers.add(identifier)
    }
  })
  container.on('jack-drag-end', ({ event }) => {
    const { data: { identifier } } = event
    // console.log('DRAG-END', { event })
    if (draggingJacks.has(jack)) {
      draggingJacks.delete(jack)
      draggingPointers.delete(identifier)
    }
    if (currentDragTarget) {
      // console.log('DRAG COMPLETE!')
      connectJacks({
        sourceJack: jack,
        targetJack: currentDragTarget
      })
      currentDragTarget = null
    }
  })
  container.on('jack-drag-cancel', ({ event }) => {
    const { data: { identifier } } = event
    // console.log('DRAG-CANCEL', { event })
    if (draggingJacks.has(jack)) {
      draggingJacks.delete(jack)
      draggingPointers.delete(identifier)
    }
    if (currentDragTarget) {
      currentDragTarget = null
    }
  })

  if (registeredJacks.has(name) === true) {
    console.error('Already Registered Jack with Name:', name)
  } else {
    registeredJacks.set(name, jack)
  }
  return () => {
    const { name } = jack
    if (registeredJacks.has(name) === true) {
      registeredJacks.delete(name)
    } else {
      console.error('Cannot remove a jack that is not in the registry.')
    }
  }
}

export const networkEject = ({ sourceJack, targetJack }) => {
  disconnectJacks({ sourceJack, targetJack })
}
