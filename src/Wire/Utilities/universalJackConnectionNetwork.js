import { PIXI } from './localPIXI.js'

import { makeAvenue } from '../Utilities/makeAvenue.js'

const {
  Texture,
  Sprite,
  display,
  SimpleRope
} = PIXI

const { Layer, Stage } = display
let registeredJacks = new Map()

const RootWireLayer = new Layer()
RootWireLayer.interactive = true

const pointerDownJacks = new Map()

const handleJackPointerDown = ({ event, jack }) => {

}

const handleJackPointerUp = ({ event, jack }) => {

}

const handleJackPointerMove = ({ event, jack }) => {

}

export const getRootWireLayer = ({
  pointerMoveTarget
}) => {

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

const masterEventCallback = ({ jack, event, eventType }) => {
  console.log({ jack, event, eventType })

}

export const registerJackOnNetwork = ({ jack }) => {
  const { name, circle } = jack
  if (registeredJacks.has(name) === true) {
    console.error('Already Registered Jack with Name:', name)
  } else {
    registeredJacks.set(name, jack)
    circle.on('pointerdown', event => {
      if (pointerDownJacks.has(event.data.identifier) === false) {
        handleJackPointerDown({ event, jack })
        pointerDownJacks.set(event.data.identifier, jack)
      }
      masterEventCallback({ eventType: 'pointerdown', jack, event })
    })
    circle.on('pointerup', event => {
      if (pointerDownJacks.has(event.data.identifier)) {
        handleJackPointerUp({ event })
        pointerDownJacks.delete(event.data.identifier)
      }
      masterEventCallback({ eventType: 'pointerup', jack, event })
    })
    circle.on('pointerupoutside', event => {
      if (pointerDownJacks.has(event.data.identifier)) {
        pointerDownJacks.delete(event.data.identifier)
      }
      masterEventCallback({ eventType: 'pointerupoutside', jack, event })
    })
    circle.on('pointerover', event => {
      masterEventCallback({ eventType: 'pointerover', jack, event })
    })
    circle.on('pointerout', event => {
      masterEventCallback({ eventType: 'pointerout', jack, event })
    })
  }
  return () => {
    const { name } = jack
    if (registeredJacks.has(name) === true) {
      registeredJacks.delete(name)
    } else {
      console.error('Cannnot remove a jack that is not in the registry.')
    }
  }
}