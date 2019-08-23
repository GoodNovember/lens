import * as PIXI from 'pixi.js-legacy'
import fs from 'fs'
import path from 'path'
// import { remote } from 'electron'
import untildify from 'untildify'
import naturalOrder from 'natural-order'
import mime from 'mime'

// const { shell } = remote

global.PIXI = PIXI
require('pixi-layers')

const {
  display,
  Text
} = PIXI

const {
  Layer
} = display

const textStyle = { fill: 0xFFFFFF, fontSize: 12, fontFamily: 'fira code' }

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
  const {
    isDirectory,
    isFile,
    isCharacterDevice,
    isBlockDevice,
    isFIFO,
    isSocket,
    isSymbolicLink,
    baseName,
    mime
  } = fileData
  let addedLabel = `other`
  let fileDetail = ' ~ unknown ~ '
  if (isDirectory) {
    addedLabel = `directory`
  } else if (isFile) {
    if (mime) {
      fileDetail = ` ${mime} `
    }
    addedLabel = `file [${fileDetail}]`
  } else if (isCharacterDevice) {
    addedLabel = `character-device`
  } else if (isBlockDevice) {
    addedLabel = `block-device`
  } else if (isFIFO) {
    addedLabel = `fifo`
  } else if (isSocket) {
    addedLabel = `socket`
  } else if (isSymbolicLink) {
    addedLabel = `symbolic-link`
  }
  const label = new Text(`[ ] ${addedLabel}\t-->\t${baseName}`, textStyle)
  container.addChild(label)
  return {
    container
  }
}

const sortFiles = inputArray => {
  return naturalOrder(inputArray, ['mime'])
}

const groupFilesAndDirectories = inputArray => {
  const [ files, directories, other ] = inputArray.reduce(([files, directories, other], item) => {
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

export const parseDirectory = directoryPath => {
  const container = new Layer()
  const normalizedPath = path.normalize(untildify(directoryPath))

  const label = new Text(`*** Folder contents for directory: ${directoryPath} ***`, textStyle)
  container.addChild(label)
  label.x = 25
  label.y = 6
  getFilesInDirectory(normalizedPath).then(rawItems => {
    const sortedItems = groupFilesAndDirectories(rawItems)
    sortedItems.map((fileData, index) => {
      const fileRep = representDirectoryItem(fileData)
      container.addChild(fileRep.container)
      fileRep.container.x = 25
      fileRep.container.y += (index * 12) + 25
    })
  })

  return { container }
}
