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

const GRID_SIZE = 64

export const makeRootUniverse = ({
  color = 'blue',
  height = 250,
  width = 250
}) => {
  const container = new Stage()
  const backgroundLayer = new Layer()
  const wireLayer = new Layer()
  const GRID_TEXTURE_SIZE = Math.max(width, height, 1000)
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

  const gridTexture = enableDragEvents(TilingSprite.from(cvs, GRID_TEXTURE_SIZE, GRID_TEXTURE_SIZE))
  gridTexture.anchor.set(0, 0)
  backgroundLayer.addChild(gridTexture)
  container.addChild(backgroundLayer)

  const internalContainer = new Layer()
  container.addChild(internalContainer)

  container.addChild(wireLayer)

  const emit = makeEventForwarder(internalContainer)

  const on = (eventName, callback) => {
    container.on(eventName, callback)
  }

  const setSize = ({ width, height }) => {
    gridTexture.width = width
    gridTexture.height = height
    emit('parent resize', { width, height })
  }

  const moveTo = (x, y) => {
    let changeOccured = false
    if (mode === 'BOTH') {
      if (internalContainer.position.x !== x) {
        internalContainer.position.x = x
        wireLayer.x = x
        gridTexture.tileTransform.position.x = x
        changeOccured = true
      }
      if (internalContainer.position.y !== y) {
        internalContainer.position.y = y
        wireLayer.y = y
        gridTexture.tileTransform.position.y = y
        changeOccured = true
      }
    } else if (mode === 'X-ONLY') {
      if (internalContainer.position.x !== x) {
        internalContainer.position.x = x
        wireLayer.x = x
        gridTexture.tileTransform.position.x = x
        changeOccured = true
      }
    } else if (mode === 'Y-ONLY') {
      if (internalContainer.position.y !== y) {
        internalContainer.position.y = y
        wireLayer.y = y
        gridTexture.tileTransform.position.y = y
        changeOccured = true
      }
    }
    if (changeOccured) {
      emit('parent move', { x, y })
    }
  }

  gridTexture.on('dragging', ({ reference: { x, y } }) => moveTo(x, y))

  const addChild = (...props) => {
    internalContainer.addChild(...props)
  }

  const removeChild = (...props) => {
    internalContainer.removeChild(...props)
  }

  const clearChildren = () => {
    removeAllChildrenFromContainer(internalContainer)
  }

  return {
    internalContainer,
    wireLayer,
    container,
    setSize,
    addChild,
    removeChild,
    clearChildren,
    emit,
    moveTo,
    on
  }
}
