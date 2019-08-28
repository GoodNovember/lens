import { makeGenericItem } from './makeGenericItem.js'
import { PIXI } from '../Utilities/localPixi.js'
import { makeRect } from '../Utilities/makeRect.js'
import { makeBigSignal } from '../Utilities/makeBigSignal.js'
import { enableDragEvents } from '../Utilities/enableDragEvents.js'
import { setupDragEvents } from '../Utilities/setupDragEvents.js'

const { display: { Layer } } = PIXI

const defaultName = 'Generic Toolbox [Other]'
const defaultWidth = 200
const defaultHeight = 175

export const makeToolboxOther = ({
  name = defaultName,
  width = defaultWidth,
  height = defaultHeight
} = {
  name: defaultName,
  width: defaultWidth,
  height: defaultHeight
}) => {
  const {
    container,
    internalContainer,
    setParent,
    getParent,
    ...genericProps
  } = makeGenericItem(name)

  const chromeLayer = new Layer()
  const visualRepresentation = makeRect({ width, height })
  const visualDragEvents = setupDragEvents(visualRepresentation)

  visualDragEvents.dragStart(() => {
    // console.log('Drag Start')
  })

  visualDragEvents.dragEnd(() => {
    // console.log('Drag End')
  })

  visualDragEvents.dragMove(({ pointerState: { startDelta: { x, y } } }) => {
    container.x += x
    container.y += y
    // console.log('Dragging')
  })

  chromeLayer.addChild(visualRepresentation)

  container.addChild(chromeLayer)
  container.addChild(internalContainer)

  const publicInterface = {
    get parent () { return getParent() },
    set parent (value) { setParent(value) },
    container,
    ...genericProps
  }
  return publicInterface
}
