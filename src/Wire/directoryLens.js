import { makeUniversalToolbox } from '../Garden/makeUniversalToolbox.js'
import { parseDirectory } from './parseDirectory.js'
import { UniversalCamera } from 'babylonjs'

export const directoryLens = ({
  directory: initialDirectory = '~'
}) => {
  let directory = initialDirectory
  let removable = null
  const universalToolbox = makeUniversalToolbox({
    x: 20,
    y: 100,
    width: 600,
    height: 400,
    mode: 'Y-ONLY'
  })
  const clearDirectory = () => {
    // universalToolbox.clearChildren()
    universalToolbox.resetPosition()
    if (removable) {
      removable()
      removable = null
    }
  }
  const renderDirectory = directoryPath => {
    if (removable) {
      removable()
      removable = null
    }
    const activeParsedDirectoryPath = parseDirectory(directoryPath)
    removable = universalToolbox.addChild(activeParsedDirectoryPath.container)
  }
  if (initialDirectory) {
    renderDirectory(initialDirectory)
  }
  return {
    ...universalToolbox,
    get directory () { return directory },
    set directory (value) {
      directory = value
      clearDirectory()
      if (directory) {
        renderDirectory(value)
      }
    }
  }
}
