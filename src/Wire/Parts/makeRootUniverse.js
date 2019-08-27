import { makeUniverse } from './makeUniverse.js'
import { makeBigSignal } from '../Utilities/makeBigSignal.js'

const kind = Symbol('Root Universe')
export const makeRootUniverse = ({ name = 'Root Universe' } = { name: 'Root Universe' }) => {
  const universe = makeUniverse({ name })
  const [emitMove, subscribeToMove, clearMoveListeners] = makeBigSignal()
  const [emitResize, subscribeToResize, clearResizeListeners] = makeBigSignal()
  const moveTo = ({ x, y }) => {
    emitMove({ x, y })
  }
  const resizeTo = ({ width, height }) => {
    emitResize({ width, height })
  }
  const destroy = () => {
    universe.destroy()
    clearMoveListeners()
    clearResizeListeners()
  }
  return {
    ...universe,
    name,
    kind,
    moveTo,
    resizeTo,
    subscribeToMove,
    subscribeToResize,
    destroy
  }
}
