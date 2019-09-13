import fs from 'fs'
import sane from 'sane'
import micromatch from 'micromatch'
import { getDirectoryFiles } from '../Utilities/getDirectoryFiles.js'

export const watchDirectory = ({ directoryPath, options = {} }) => new Promise((resolve, reject) => {
  const watcher = sane(directoryPath, options)
  watcher.on('ready', () => {
    getDirectoryFiles(directoryPath).then(rawFiles => {
      if (Array.isArray(options.glob)) {
        const files = micromatch(rawFiles, options.glob)
        resolve({ watcher, files })
      } else if (typeof options.glob === 'string') {
        const files = micromatch(rawFiles, [options.glob])
        resolve({ watcher, files })
      } else {
        resolve({ watcher, files: rawFiles })
      }
    }).catch(reject)
  })
})

export const read = ({ filePath, options }) => new Promise((resolve, reject) => {
  fs.readFile(filePath, options, (error, data) => {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  })
})

export const write = ({ filePath, data, options }) => new Promise((resolve, reject) => {
  fs.writeFile(filePath, data, options, (error, data) => {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  })
})
