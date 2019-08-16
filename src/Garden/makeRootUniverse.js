/* globals screen */
import { enableDragEvents } from './enableDragEvents.js'
import * as PIXI from 'pixi.js'
global.PIXI = PIXI
require('pixi-layers')

const {
  display,
  Graphics,
  TilingSprite
} = PIXI

const { Layer, Stage } = display

const GRID_SIZE = 200

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

  const toolboxLayer = new Layer()
  container.addChild(toolboxLayer)

  const setSize = ({ width, height }) => {
    gridTexture.width = width
    gridTexture.height = height
  }

  gridTexture.on('dragging', (dragEvent) => {
    const { reference } = dragEvent
    const { x, y } = reference
    if (mode === 'BOTH') {
      if (toolboxLayer.position.x !== x) {
        toolboxLayer.position.x = x
        gridTexture.tileTransform.position.x = x
      }
      if (toolboxLayer.position.y !== y) {
        toolboxLayer.position.y = y
        gridTexture.tileTransform.position.y = y
      }
    } else if (mode === 'X-ONLY') {
      if (toolboxLayer.position.x !== x) {
        toolboxLayer.position.x = x
        gridTexture.tileTransform.position.x = x
      }
    } else if (mode === 'Y-ONLY') {
      if (toolboxLayer.position.y !== y) {
        toolboxLayer.position.y = y
        gridTexture.tileTransform.position.y = y
      }
    }
  })

  const drawMask = ({ width, height, x, y }) => {
    const mask = new Graphics()
    mask.beginFill()
    mask.drawRect(x, y, width, height)
    mask.endFill()
    container.mask = mask
  }

  const addChild = child => {
    toolboxLayer.addChild(child)
  }

  return {
    toolboxLayer,
    container,
    setSize,
    drawMask,
    addChild
  }
}
