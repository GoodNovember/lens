import { enableDragEvents } from '../Utilities/enableDragEvents.js'
import { makeEventForwarder } from '../Utilities/makeEventForwarder.js'
import { PIXI } from '../Utilities/localPIXI.js'

const {
  display,
  TilingSprite
} = PIXI

const { Layer, Stage } = display

const GRID_SIZE = 32

export const makeUniverse = ({
  color = 'black',
  mode = 'BOTH',
  hideGrid = false
}) => {
  const container = new Stage()

  const cvs = document.createElement('canvas')
  const ctx = cvs.getContext('2d')
  if (hideGrid === false) {
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
  }

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

  function addChild (...args) {
    internalContainer.addChild(...args)
    return () => {
      removeChild(...args)
    }
  }

  function removeChild (...args) {
    internalContainer.removeChild(...args)
  }

  const clearChildren = () => {
    internalContainer.children.forEach(child => internalContainer.removeChild(child))
    emit('redraw mask')
  }

  container.on('parent resize', (...props) => {
    emit('parent resize', ...props)
  })

  container.on('parent move', (...props) => {
    emit('parent move', ...props)
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
    } else if (mode === 'X-ONLY') {
      if (internalContainer.position.x !== x) {
        setX(x)
        changeOccured = true
      }
    } else if (mode === 'Y-ONLY') {
      if (internalContainer.position.y !== y) {
        setY(y)
        changeOccured = true
      }
    }
    if (changeOccured === true) {
      gridTexture.emit('set drag reference', { x, y })
      emit('redraw mask')
    }
  }

  gridTexture.on('dragging', ({ reference: { x, y } }) => {
    moveTo(x, y)
  }).on('pointerdown', stuff => {
    container.emit('pointerdown', stuff)
  })

  const resetPosition = () => moveTo(0, 0)

  return {
    moveTo,
    container,
    addChild,
    removeChild,
    clearChildren,
    resetPosition,
    setSize,
    emit,
    on
  }
}
