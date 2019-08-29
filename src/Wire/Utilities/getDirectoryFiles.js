import { readdir } from 'fs'
import path from 'path'
export const getDirectoryFiles = directoryPath => new Promise((resolve, reject) => {
  readdir(directoryPath, (error, filesArray) => {
    if (error) {
      reject(error)
    } else {
      resolve(filesArray.map(filePath => path.normalize(path.join(directoryPath, filePath))))
    }
  })
})
