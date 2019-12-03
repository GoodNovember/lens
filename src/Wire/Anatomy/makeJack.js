import { PIXI } from '../Utilities/localPIXI.js'
import theme from '../Theme/imperfection/theme.js'
import { registerJackOnNetwork, networkEject } from '../Utilities/universalJackConnectionNetwork.js'
import { makeConnectionBetweenJacks } from './makeConnectionBetweenJacks.js'
import StateMachine from 'javascript-state-machine'

const { display } = PIXI

const { Stage } = display

export const makeJack = async ({
  name,
  universe,
  tint = 0xffffffff,
  themeImage = 'frameEmpty',
  kind,
  connectionValidator = ({ jack, selfJack, ...others }) => true, // we trust, for now.
  x,
  y,
  node = null,
  initialValue = null,
  onConnect = () => { },
  onDisconnect = () => { }
}) => {

  let lastPayloadSent = initialValue
  let lastPayloadRecieved = initialValue

  const internalConnections = new Set()

  const awakeTint = 0xffffff
  const napTint = 0x333333
  const pressTint = 0xff0000
  const dragTint = 0xffff00

  const container = new Stage()
  const textures = await theme.getTextures()
  const chosenSprite = textures[themeImage] || textures.frameFull
  const sprite = chosenSprite.makeSprite()
  sprite.tint = napTint
  sprite.interactive = true
  sprite.anchor.set(0.5)
  container.x = x
  container.y = y
  container.addChild(sprite)

  let isAwake = false

  const stateMachine = StateMachine({
    init: 'idle',
    transitions: [
      { name: 'awaken', from: 'idle', to: 'awake' },
      { name: 'nap', from: 'awake', to: 'idle' },
      { name: 'press', from: 'awake', to: 'pressing' },
      {
        name: 'release', from: 'pressing', to() {
          if (isAwake) {
            return 'awake'
          } else {
            return 'idle'
          }
        }
      },
      { name: 'dragBegin', from: 'pressing', to: 'dragging' },
      {
        name: 'dragEnd', from: 'dragging', to() {
          if (isAwake) {
            return 'awake'
          } else {
            return 'idle'
          }
        }
      },
      {
        name: 'dragCancel', from: 'dragging', to: 'pressing'
      }
    ],
    methods: {
      onAwaken(state, ...rest) {
        // console.log(`!!! Awaken ${name}`)
        sprite.tint = awakeTint
        container.emit('jack-awaken', ...rest)
      },
      onNap(state, ...rest) {
        // console.log(`!!! Nap ${name}`)
        sprite.tint = napTint
        container.emit('jack-nap', ...rest)
      },
      onPressing(state, ...rest) {
        // console.log(`!!! Pressing ${name}`)
        sprite.tint = pressTint
        container.emit('jack-pressing', ...rest)
      },
      onRelease(state, ...rest) {
        // console.log(`!!! Release ${name}`)
        sprite.tint = awakeTint
        container.emit('jack-release', ...rest)
      },
      onDragBegin(state, ...rest) {
        // console.log(`!!! DragBegin ${name}`)
        sprite.tint = dragTint
        container.emit('jack-drag-start', ...rest)
      },
      onDragCancel(state, ...rest) {
        // console.log(`!!! DragCancel ${name}`)
        sprite.tint = pressTint
        container.emit('jack-drag-cancel', ...rest)
      },
      onDragging(state, ...rest) {
        // console.log(`!!! Dragging ${name}`)
        container.emit('jack-dragging', ...rest)
      },
      onDragEnd(state, ...rest) {
        // console.log(`!!! DragEnd ${name}`)
        if (isAwake) {
          sprite.tint = awakeTint
        } else {
          sprite.tint = napTint
        }
        container.emit('jack-drag-end', ...rest)
      },
    }
  })

  const handlePointerDown = event => {
    if (stateMachine.is('awake')) {
      stateMachine.press({ event })
    }
  }
  sprite.on('pointerdown', handlePointerDown)

  const handlePointerUp = event => {
    if (stateMachine.is('pressing')) {
      stateMachine.release({ event })
    }
  }
  sprite.on('pointerup', handlePointerUp)

  const handlePointerUpOutside = event => {
    if (stateMachine.is('dragging')) {
      stateMachine.dragEnd({ event })
    }
  }
  sprite.on('pointerupoutside', handlePointerUpOutside)

  const handlePointerOver = event => {
    isAwake = true
    if (stateMachine.is('idle')) {
      stateMachine.awaken({ event })
    } else if (stateMachine.is('dragging')) {
      stateMachine.dragCancel({ event })
    }
  }
  sprite.on('pointerover', handlePointerOver)

  const handlePointerOut = event => {
    isAwake = false
    if (stateMachine.is('awake')) {
      stateMachine.nap({ event })
    } else if (stateMachine.is('pressing')) {
      stateMachine.dragBegin({ event })
    }
  }
  sprite.on('pointerout', handlePointerOut)

  const broadcastToConnections = payload => {
    lastPayloadSent = payload
    for (const otherJack of internalConnections) {
      otherJack.receiveBroadcast({ jack: selfJack, payload })
    }
  }

  const receiveBroadcast = ({ jack, payload }) => {
    lastPayloadRecieved = payload
    container.emit('broadcast', { jack, payload })
  }

  const selfJack = {
    get x() { // surely the real math is much prettier.
      return container.toGlobal(universe.wireLayer.position).x - universe.wireLayer.x * 2
    },
    get y() {
      return container.toGlobal(universe.wireLayer.position).y - universe.wireLayer.y * 2
    },
    get node() {
      return node || null
    },
    get lastPayloadSent() {
      return lastPayloadSent
    },
    get lastPayloadRecieved() {
      return lastPayloadRecieved
    },
    name,
    get connections() {
      return internalConnections
    },
    get tint() {
      return sprite.tint
    },
    set tint(tintValue) {
      sprite.tint = tintValue
    },
    sprite,
    isConnectedTo,
    stateMachine,
    receiveConnectionRequest,
    broadcastToConnections,
    receiveBroadcast,
    connectTo,
    container,
    universe,
    reconnect,
    eject,
    kind
  }

  function eject(otherJack) {
    console.log(`EJECT me:${name} them:${otherJack.name} `)
    if (internalConnections.has(otherJack)) {
      internalConnections.delete(otherJack)
      onDisconnect({ jack: otherJack, selfJack })
      networkEject({ sourceJack: selfJack, targetJack: otherJack })
    }
    if (otherJack.connections.has(selfJack)) {
      otherJack.eject(selfJack)
      otherJack.connections.delete(otherJack)
    }
  }

  function reconnect() {
    for (const jack of internalConnections.values()) {
      onConnect({ jack, selfJack })
    }
  }

  function isConnectedTo({ jack }) {
    if (internalConnections.has(jack)) {
      return true
    } else if (jack.connections.has(selfJack)) {
      return true
    } else {
      return false
    }
  }

  function receiveConnectionRequest({ jack, target, source, ...others }) {
    return new Promise((resolve, reject) => {
      if (typeof connectionValidator === 'function') {
        let result = null
        try {
          result = connectionValidator({ jack, selfJack, target, source, ...others })
          console.log('result', result)
        } catch (error) {
          console.log('error', error)
          reject(error)
        }
        resolve(!!result)
      } else {
        console.error('Hey man, I was looking for a callback function, would you mind sending one of those instead of this:', { connectionValidator })
      }
    })
  }

  function connectTo({ jack, ...others }) {
    let isAlive = true
    let disconnect = () => { }
    let personalVerdict = null
    const target = jack
    const source = selfJack
    if (typeof connectionValidator === 'function') {
      try {
        personalVerdict = connectionValidator({ jack, selfJack, target, source, ...others })
      } catch (error) {
        console.error(error)
      }
    }
    if (personalVerdict) {
      jack.receiveConnectionRequest({ jack: selfJack, target, source, ...others }).then(async (isSuccessful) => {
        if (isAlive === true) {
          if (isSuccessful) {
            onConnect({ jack, selfJack })
            disconnect = await makeConnectionBetweenJacks({ jackA: selfJack, jackB: jack, universe })
            internalConnections.add(jack)
            jack.connections.add(selfJack)
          } else {
            console.info(`jack [${name}] -- Jack Connection Request Denied. I got rejected.`, { selfJack, jack })
          }
        }
      }).catch(error => {
        console.error(`jack [${name}] -- Jack Connection Request Error. Something weird happened.`, error)
      })
    } else {
      console.error(`jack [${name}] -- Jack Connection Request Refused. I don't like it.`, { jack, selfJack })
    }

    return () => {
      isAlive = false
      onDisconnect({ jack, selfJack })
      eject(jack)
      if (typeof disconnect === 'function') {
        disconnect()
      }
    }
  }

  registerJackOnNetwork({ jack: selfJack })

  return selfJack
}
