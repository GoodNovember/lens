import { makeBigSignal } from '../Utilities/makeBigSignal.js'
import { makeGenericItem } from './makeGenericItem.js'
import { PIXI } from '../Utilities/localPixi.js'
import { makeRect } from '../Utilities/makeRect.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'

const makeDragRect = makeRectInput => enableDragEvents(makeRect(makeRectInput))

const { display: { Layer } } = PIXI

const kind = Symbol('Toolbox')

export const makeToolbox = ({
  name = 'Generic Toolbox',
  x,
  y,
  width,
  height
}) => {
  const [emitMove, subscribeToMove, clearMoveListeners] = makeBigSignal()
  const [emitResize, subscribeToResize, clearResizeListeners] = makeBigSignal()

  const {
    container,
    internalContainer,
    getChildren,
    setParent,
    getParent,
    ...genericProps
  } = makeGenericItem(name)

  const chromeLayer = new Layer()

  const visualRepresentation = makeDragRect({ height, width })
  chromeLayer.addChild(visualRepresentation)

  visualRepresentation.on('dragging', ({
    pointerState: { startDelta }
  }) => {
    moveBy(startDelta)
  })

  container.addChild(chromeLayer)
  container.addChild(internalContainer)

  internalMoveTo({ x, y })

  const publicToolboxInterface = {
    get parent () { return getParent() },
    set parent (value) { setParent(value) },
    get children () { return getChildren() },
    ...genericProps,
    subscribeToResize,
    internalContainer,
    subscribeToMove,
    container,
    resizeTo,
    destroy,
    moveTo,
    kind,
    name
  }

  function destroy () {
    console.log('Would Destroy Toolbox')
    clearMoveListeners()
    clearResizeListeners()
  }

  function internalMoveTo ({ x, y }) {
    container.x = x
    container.y = y
  }

  function internalMoveBy ({ x, y }) {
    container.x += x
    container.y += y
  }

  function moveTo ({ x, y }) {
    internalMoveTo({ x, y })
    emitMove({ x, y })
  }

  function moveBy ({ x, y }) {
    internalMoveBy({ x, y })
    emitMove({
      x: container.x,
      y: container.y
    })
  }

  function resizeTo ({ width, height }) {
    emitResize({ width, height })
  }

  return publicToolboxInterface
}
