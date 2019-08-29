import { makeUniversalToolbox } from './makeUniversalToolbox.js'
import { makeStringPrimitive } from './makeStringPrimitive.js'
import { makeListBox } from './makeListBox.js'
import { getDirectoryFiles } from '../Utilities/getDirectoryFiles.js'
import { getItemInformation } from '../Utilities/getItemInformation.js/'
import untildify from 'untildify'
import tildify from 'tildify'
import Path from 'path'

const categorizeFilePaths = filePathArray => new Promise((resolve, reject) => {
  Promise.all(filePathArray.map(filePath => getItemInformation(untildify(filePath)))).then(dataArray => {
    const [directories, files, other] = dataArray.reduce(([directories, files, other], { path, stats }) => {
      if (stats.isDirectory()) {
        directories.push({ stats, path })
      } else if (stats.isFile()) {
        files.push({ stats, path })
      } else {
        other.push({ stats, path })
      }
      return [directories, files, other]
    }, [[], [], []])
    resolve([directories, files, other].flat().map(({ path, stats }) => {
      if (stats.isDirectory()) {
        return {
          label: `+ ${Path.basename(path)}`,
          value: tildify(path)
        }
      } else {
        return {
          label: `  ${Path.basename(path)}`,
          value: tildify(path)
        }
      }
    }))
  }).catch(reject)
})

const getAllItemsFromDirectory = directoryPath => new Promise((resolve, reject) => {
  const normalzedPath = untildify(directoryPath)
  const parentPath = Path.dirname(normalzedPath)
  getDirectoryFiles(normalzedPath)
    .then(rawFiles => {
      categorizeFilePaths(rawFiles).then(compiledFiles => {
        resolve([ { label: '..(parent directory)', value: Path.normalize(tildify(parentPath)) }, ...compiledFiles ])
      }).catch(reject)
    })
    .catch(reject)
})

export const makeDirectoryLens = ({
  directory = `~/Desktop`
}) => {
  const universalToolbox = makeUniversalToolbox({
    width: 800,
    height: 550
  })
  const stringPrimitive = makeStringPrimitive({
    x: 8,
    y: 8,
    width: 300,
    height: 64
  })
  const listBox = makeListBox({
    x: 8,
    y: 80,
    width: 700,
    height: 416,
    mode: 'Y-ONLY',
    hideGrid: true
  })

  stringPrimitive.container.on('parent resize', ({ width, height }) => {
    // console.log('Resize', { width, height })
  })

  stringPrimitive.value = directory
  stringPrimitive.subscribeToValueChange(newValue => {
    getAllItemsFromDirectory(newValue).then(files => {
      listBox.updateList(files)
    })
  })

  universalToolbox.addChild(stringPrimitive.container)
  universalToolbox.addChild(listBox.container)

  listBox.subscribeToClick(value => {
    getItemInformation(untildify(value)).then(({ path, stats }) => {
      if (stats.isDirectory()) {
        stringPrimitive.value = tildify(path)
      } else {
        console.log('FILE', path)
      }
    }).catch(error => {
      console.error(error)
    })
  })

  return {
    ...universalToolbox
  }
}
