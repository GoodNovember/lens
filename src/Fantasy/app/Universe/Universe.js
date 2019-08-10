/* globals screen */
import { Toolbox } from '../Toolbox/Toolbox'
import * as PIXI from 'pixi.js'

import * as KNOWN_KINDS from '../index.js'

import {
  ensureDefaults,
  enableDragEvents
} from '../utilities'

global.PIXI = PIXI

require('pixi-layers')

const {
  display,
  Graphics,
  TilingSprite
} = PIXI
const { Layer, Stage } = display

const GRID_SIZE = 100

export const UNIVERSE_MODES = {
  BOTH: 'BOTH',
  X_ONLY: 'X_ONLY',
  Y_ONLY: 'Y_ONLY',
  NONE: 'NONE'
}

export class Universe {
  constructor (ingredients) {
    const defaults = {
      children: [],
      scale: 1.0,
      mode: UNIVERSE_MODES.BOTH
    }

    const args = ensureDefaults(ingredients, defaults)

    const cvs = document.createElement('canvas')
    const ctx = cvs.getContext('2d')

    cvs.width = GRID_SIZE
    cvs.height = GRID_SIZE
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = 'red'
    ctx.moveTo(0, 0)
    ctx.lineTo(GRID_SIZE, 0)
    ctx.moveTo(0, 0)
    ctx.lineTo(0, GRID_SIZE)
    ctx.stroke()

    const self = this

    self.kind = 'Universe'

    self.children = args.children
    self.mode = args.mode

    self.container = new Stage()

    self.backgroundLayer = new Layer()

    const GRID_TEXTURE_SIZE = Math.max(screen.width, screen.height, 1000)

    const gridTexture = enableDragEvents(TilingSprite.from(cvs, GRID_TEXTURE_SIZE, GRID_TEXTURE_SIZE))
    gridTexture.anchor.set(0.5, 0.5)
    self.backgroundLayer.addChild(gridTexture)
    self.container.addChild(self.backgroundLayer)

    self.toolboxLayer = new Layer()
    self.toolboxLayer.group.enableSort = true
    self.container.addChild(self.toolboxLayer)

    gridTexture.on('dragstart', (event) => {
      // self.toolboxLayer.alpha = 0.5
    }).on('dragging', (dragEvent) => {
      let isValid = false
      const { reference } = dragEvent
      const { x, y } = reference
      if (self.mode === UNIVERSE_MODES.BOTH) {
        if (self.toolboxLayer.position.x !== x) {
          self.toolboxLayer.position.x = x
          gridTexture.tileTransform.position.x = x
          isValid = true
        }
        if (self.toolboxLayer.position.y !== y) {
          self.toolboxLayer.position.y = y
          gridTexture.tileTransform.position.y = y
          isValid = true
        }
      } else if (self.mode === UNIVERSE_MODES.X_ONLY) {
        if (self.toolboxLayer.position.x !== x) {
          self.toolboxLayer.position.x = x
          gridTexture.tileTransform.position.x = x
          isValid = true
        }
      } else if (self.mode === UNIVERSE_MODES.Y_ONLY) {
        if (self.toolboxLayer.position.y !== y) {
          self.toolboxLayer.position.y = y
          gridTexture.tileTransform.position.y = y
          isValid = true
        }
      }
      if (isValid) {
        self.toolboxLayer.children.map((child) => {
          // We have moved. Notify the children.
          child.emit('parent moved')
        })
      }
    }).on('dragend', (event) => {
      // self.toolboxLayer.alpha = 1
    })

    // A universe outside outside ourselves has moved. Notify the children.
    self.container.on('parent moved', (e) => {
      self.toolboxLayer.children.map((child) => {
        child.emit('parent moved', { e })
      })
    })

    self.container.on('layout', ({ parent, w, h }) => {
      gridTexture.width = w
      gridTexture.height = h
      gridTexture.x = w / 2
      gridTexture.y = h / 2
    })

    self.children.map((child) => {
      const { kind } = child
      if (kind === self.kind) {
        const instance = new Universe(self.addUniverseTo(child))
        self.toolboxLayer.addChild(instance.container)
      } else {
        if (KNOWN_KINDS[kind]) {
          const instance = new KNOWN_KINDS[kind](self.addUniverseTo(child))
          self.toolboxLayer.addChild(instance.container)
        } else {
          console.error('Unknown Child Kind:', kind, child)
        }
      }
    })
  }
  layout () {
    const parent = this
    const w = this.container.width
    const h = this.container.height

    this.toolboxLayer.container.map((child) => {
      child.emit('parent_layout', { w, h, parent })
    })
    this.redrawLayout(w, h)
  }
  redrawLayout (w, h) {
    if (this.gridTexture) {
      this.gridTexture.width = w
      this.gridTexture.height = h
      this.gridTexture.x = w / 2
      this.gridTexture.y = h / 2
    }
  }
  addUniverseTo (ingredients) {
    return Object.assign({}, ingredients, { universe: this })
  }
  drawMask ({ x, y, w, h }) {
    const mask = new Graphics()
    mask.beginFill()
    mask.drawRect(x, y, w, h)
    mask.endFill()
    this.container.mask = mask
  }
  addToolbox (ingredients) {
    this.toolboxLayer.addChild(new Toolbox(this.addUniverseTo(ingredients)).container)
  }
}
