import { enableDragEvents } from './enableDragEvents.js'
import { makeEventForwarder } from './makeEventForwarder.js'
import { removeAllChildrenFromContainer } from './utilities.js'
// import * as PIXI from 'pixi.js'
import * as PIXI from 'pixi.js-legacy'
global.PIXI = PIXI
require('pixi-layers')

const {
  display,
  TilingSprite
} = PIXI

const { Layer, Stage } = display

const GRID_SIZE = 32

export const makeUniverse = ({ color = 'black' }) => {
  const container = new Stage()

  const cvs = document.createElement('canvas')
  const ctx = cvs.getContext('2d')

  const mode = 'BOTH'

  cvs.width = GRID_SIZE
  cvs.height = GRID_SIZE
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = color
  ctx.moveTo(0, 0)
  ctx.lineTo(GRID_SIZE, 0)
  ctx.moveTo(0, 0)
  ctx.lineTo(0, GRID_SIZE)
  ctx.stroke()

  const backroundLayer = new Layer()
  container.addChild(backroundLayer)

  const gridTexture = enableDragEvents(TilingSprite.from(cvs, 250, 250))
  backroundLayer.addChild(gridTexture)

  const internalContainer = new Layer()
  internalContainer.group.enableSort = true
  container.addChild(internalContainer)

  const emit = makeEventForwarder(internalContainer)

  const on = (eventName, callback) => {
    container.on(eventName, callback)
  }

  const setSize = (width, height) => {
    gridTexture.width = width
    gridTexture.height = height
    emit('parent resize', { width, height })
  }

  const addChild = (...args) => {
    internalContainer.addChild(...args)
  }

  const removeChild = (...args) => {
    internalContainer.removeChild(...args)
  }

  const clearChildren = () => {
    removeAllChildrenFromContainer(internalContainer)
  }

  container.on('parent resized', (...props) => {
    emit('parent resized', ...props)
  })

  container.on('parent moved', (...props) => {
    emit('parent moved', ...props)
  })

  const moveTo = (x, y) => {
    let changeOccured = false
    const setX = x => {
      internalContainer.position.x = x
      gridTexture.tileTransform.position.x = x
    }
    const setY = y => {
      internalContainer.position.y = y
      gridTexture.tileTransform.position.y = y
    }
    if (mode === 'BOTH') {
      if (internalContainer.position.x !== x) {
        setX(x)
        changeOccured = true
      }
      if (internalContainer.position.y !== y) {
        setY(y)
        changeOccured = true
      }
    } else if (mode === 'X_ONLY') {
      if (internalContainer.position.x !== x) {
        setX(x)
        changeOccured = true
      }
    } else if (mode === 'Y_ONLY') {
      if (internalContainer.position.y !== y) {
        setY(y)
        changeOccured = true
      }
    }
    if (changeOccured === true) {
      emit('parent moved', { x, y })
    }
  }

  gridTexture.on('dragging', ({ reference: { x, y } }) => {
    moveTo(x, y)
  }).on('pointerdown', stuff => {
    container.emit('pointerdown', stuff)
  })

  return {
    moveTo,
    container,
    addChild,
    removeChild,
    clearChildren,
    setSize,
    emit,
    on
  }
}
