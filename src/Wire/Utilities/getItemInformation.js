import fs from 'fs'

export const getItemInformation = itemPath => new Promise((resolve, reject) => {
  fs.lstat(itemPath, (error, stats) => {
    if (error) {
      reject(error)
    } else {
      resolve({ path: itemPath, stats })
    }
  })
})
