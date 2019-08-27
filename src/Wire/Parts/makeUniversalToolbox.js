import { makeToolbox } from './makeToolbox.js'
import { makeUniverse } from './makeUniverse.js'

const kind = Symbol('Universal Toolbox')

export const makeUniversalToolbox = ({
  universeIngredients = {},
  toolboxIngredients = {}
}) => {
  const toolbox = makeToolbox(toolboxIngredients)
  const universe = makeUniverse(universeIngredients)

  const {
    addChild,
    removeChild,
    setParent
  } = universe

  universe.addChild(toolbox)

  const destroy = () => {
    toolbox.destroy()
    universe.destroy()
  }

  const publicUniversalToolboxInterface = {
    ...toolbox,
    addChild,
    removeChild,
    setParent,
    kind,
    destroy
  }

  return publicUniversalToolboxInterface
}
