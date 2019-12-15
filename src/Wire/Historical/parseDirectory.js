import fs from 'fs'
import path from 'path'
import untildify from 'untildify'
import naturalOrder from 'natural-order'
import mime from 'mime'

import { PIXI } from '../Utilities/localPIXI.js'

const {
  display: { Layer },
  Text,
  TextStyle
} = PIXI

const makeStyle = inputObj => new TextStyle(inputObj)

const makeTextWithStyle = ({ regularStyle, hoverStyle, activeStyle }) => string => {
  const textElement = new Text(string, regularStyle)
  textElement.interactive = true
  textElement.on('pointerdown', () => {
    if (activeStyle) {
      textElement.style = activeStyle
    }
  })
  textElement.on('pointerover', () => {
    if (hoverStyle) {
      textElement.style = hoverStyle
    }
  })
  textElement.on('pointerup', () => {
    textElement.style = regularStyle
  })
  textElement.on('pointerout', () => {
    if (regularStyle) {
      textElement.style = regularStyle
    }
  })
  return textElement
}

const fontFamily = `fira code`
const fontSize = 12

const BLACK = 0x000000
const RED = 0xff0000
const GREEN = 0x00ff00
const BLUE = 0x0000ff
const DARK_GREEN = 0x003300

const normalText = makeTextWithStyle({
  regularStyle: makeStyle({ fill: BLACK, fontFamily, fontSize })
})

const fileText = makeTextWithStyle({
  regularStyle: makeStyle({ fill: BLUE, fontFamily, fontSize }),
  hoverStyle: makeStyle({ fill: RED, fontFamily, fontSize }),
  activeStyle: makeStyle({ fill: GREEN, fontFamily, fontSize })
})

const directoryText = makeTextWithStyle({
  regularStyle: makeStyle({ fill: DARK_GREEN, fontFamily, fontSize }),
  hoverStyle: makeStyle({ fill: RED, fontFamily, fontSize }),
  activeStyle: makeStyle({ fill: GREEN, fontFamily, fontSize })
})

const getFileStat = filePath => new Promise((resolve, reject) => {
  fs.stat(filePath, (error, stats) => {
    if (error) {
      reject(error)
    } else {
      const isDirectory = stats.isDirectory()
      const isFile = stats.isFile()
      const isBlockDevice = stats.isBlockDevice()
      const isCharacterDevice = stats.isCharacterDevice()
      const isFIFO = stats.isFIFO()
      const isSocket = stats.isSocket()
      const extension = path.extname(filePath)
      const baseName = path.basename(filePath)
      const isDotFile = baseName.length > 0 && baseName[0] === '.'
      const isSymbolicLink = stats.isSymbolicLink()
      const dirName = path.dirname(filePath)
      resolve({
        mime: mime.getType(extension),
        ...stats,
        dirName,
        filePath: path.normalize(filePath),
        baseName,
        isDotFile,
        isDirectory,
        extension,
        isFile,
        isBlockDevice,
        isFIFO,
        isCharacterDevice,
        isSocket,
        isSymbolicLink
      })
    }
  })
})

const getDirectoryFiles = directoryPath => new Promise((resolve, reject) => {
  fs.readdir(directoryPath, (error, files) => {
    if (error) {
      reject(error)
    } else {
      resolve(files.map(itemName => `${directoryPath}/${itemName}`))
    }
  })
})

const getFilesInDirectory = directoryPath => getDirectoryFiles(directoryPath).then(filePaths => Promise.all(filePaths.map(filePath => getFileStat(filePath))))

const representDirectoryItem = fileData => {
  const container = new Layer()
  const label = normalText(JSON.stringify(fileData))
  container.addChild(label)
  return {
    container,
    get height() { return label.height },
    get width() { return label.width }
  }
}

const sortFiles = inputArray => {
  return naturalOrder(inputArray, ['mime'])
}

const groupFilesAndDirectories = inputArray => {
  const [files, directories, other] = inputArray.reduce(([files, directories, other], item) => {
    const { isFile, isDirectory } = item
    if (isFile) {
      files.push(item)
    } else if (isDirectory) {
      directories.push(item)
    } else {
      other.push(item)
    }
    return [files, directories, other]
  }, [[], [], []])
  const outputFiles = sortFiles(files)
  return [directories, outputFiles, other].flat()
}

const COMFORT_MARGIN = 8

export const parseDirectory = directoryPath => {
  const container = new Layer()
  const normalizedPath = path.normalize(untildify(directoryPath))
  getFilesInDirectory(normalizedPath).then(rawItems => {
    const sortedItems = groupFilesAndDirectories(rawItems)
    sortedItems.map((fileData, index) => {
      const fileRep = representDirectoryItem(fileData)
      container.addChild(fileRep.container)
      fileRep.container.x = COMFORT_MARGIN
      fileRep.container.y += (index * fileRep.height) + COMFORT_MARGIN
    })
  })

  return { container }
}
