import { makeListBox } from '../Parts/makeListBox.js'
import { getDirectoryFiles } from '../Utilities/getDirectoryFiles.js'
import { makeStringPrimitive } from './Parts/makeStringPrimitive.js/index.js'
import untildify from 'untildify'
import path from 'path'

export const directoryLens = ({
  directory: initialDirectory = '~'
}) => {
  const stringPrimitive = makeStringPrimitive({ value: initialDirectory, x: 10, y: 10 })
  let directory = initialDirectory
  let removable = null

  const lensBox = makeListBox({
    x: 10,
    y: 95,
    width: 700,
    height: 400,
    mode: 'Y-ONLY',
    hideGrid: true
  })

  lensBox.addChild(stringPrimitive.container)

  lensBox.subscribeToClick(value => {
    console.log({ value })
  })

  const clearDirectory = () => {
    lensBox.resetPosition()
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
    getDirectoryFiles(untildify(directoryPath))
      .then(filesArray => {
        lensBox.updateList(filesArray.map(fileName => path.normalize(path.join(directoryPath, fileName))))
      })
      .catch(error => {
        console.error(error)
      })
  }
  if (initialDirectory) {
    renderDirectory(initialDirectory)
  }
  return {
    ...lensBox,
    subscribeToClick: lensBox.subscribeToClick,
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
