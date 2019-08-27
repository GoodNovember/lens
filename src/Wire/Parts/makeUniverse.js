import { makeGenericItem } from './makeGenericItem'

const kind = Symbol('Universe')

export const makeUniverse = ({ name = 'Generic Universe' } = { name: 'Generic Universe' }) => {
  const {
    container,
    internalContainer,
    getParent,
    setParent,
    getChildren,
    ...genericProps
  } = makeGenericItem(name)

  container.addChild(internalContainer)

  const publicUniverseInterface = {
    get parent () { return getParent() },
    set parent (value) { setParent(value) },
    get children () { return getChildren() },
    ...genericProps,
    internalContainer,
    container,
    setParent,
    destroy,
    name,
    kind,
    log
  }

  function log () {
    console.log('Universe Log:', {
      publicUniverseInterface
    })
  }

  function destroy () {
    console.log('Would Destroy Universe.')
  }

  return publicUniverseInterface
}
