/* globals screen */
import { enableDragEvents } from './enableDragEvents.js'
import { makeEventForwarder } from './makeEventForwarder.js'
import * as PIXI from 'pixi.js'
global.PIXI = PIXI
require('pixi-layers')

const {
  display,
  Graphics,
  TilingSprite
} = PIXI

const { Layer, Stage } = display

const GRID_SIZE = 50

export const makeRootUniverse = ({ color = 'blue' }) => {
  const container = new Stage()
  const backgroundLayer = new Layer()
  const GRID_TEXTURE_SIZE = Math.max(screen.width, screen.height, 1000)
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

  const tellTheKids = makeEventForwarder(internalContainer)

  const setSize = ({ width, height }) => {
    gridTexture.width = width
    gridTexture.height = height
    tellTheKids('parent resize')({width, height})
  }

  gridTexture.on('dragging', (dragEvent) => {
    let changeOccured = false
    const { reference } = dragEvent
    const { x, y } = reference
    if (mode === 'BOTH') {
      if (internalContainer.position.x !== x) {
        internalContainer.position.x = x
        gridTexture.tileTransform.position.x = x
        changeOccured = true
      }
      if (internalContainer.position.y !== y) {
        internalContainer.position.y = y
        gridTexture.tileTransform.position.y = y
        changeOccured = true
      }
    } else if (mode === 'X-ONLY') {
      if (internalContainer.position.x !== x) {
        internalContainer.position.x = x
        gridTexture.tileTransform.position.x = x
        changeOccured = true
      }
    } else if (mode === 'Y-ONLY') {
      if (internalContainer.position.y !== y) {
        internalContainer.position.y = y
        gridTexture.tileTransform.position.y = y
        changeOccured = true
      }
    }
    if (changeOccured) {
      tellTheKids('parent moved')({x, y})
    }
  })

  const addChild = (...props) => {
    internalContainer.addChild(...props)
  }
  
  const removeChild = (...props) => {
    internalContainer.removeChild(...props)
  }

  const emit = (eventName, payload) => {
    tellTheKids(eventName)(payload)
  }

  const on = (eventName, callback) => {
    container.on(eventName, callback)
  }

  return {
    internalContainer,
    container,
    setSize,
    addChild,
    removeChild,
    emit,
    on,
  }
}
