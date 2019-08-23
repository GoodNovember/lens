import * as PIXI from 'pixi.js-legacy'
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import untildify from 'untildify'
import extName from 'ext-name'

const { shell } = remote

global.PIXI = PIXI
require('pixi-layers')

const {
  display,
  Graphics
} = PIXI

const {
  Layer,
  Stage
} = display

const getFileStat = filePath => new Promise((resolve, reject) => {
  fs.lstat(filePath, (error, stats) => {
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
      const types = isFile ? extName(filePath) : []
      resolve({
        types,
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

export const parseDirectory = directoryPath => {
  const container = new Layer()
  const normalizedPath = path.normalize(untildify(directoryPath))

  console.log(`Would Parse Directory = ${normalizedPath}`)
  getFilesInDirectory(normalizedPath).then(files => {
    console.log({ files: files.map(file => file) })
  })

  return { container }
}
