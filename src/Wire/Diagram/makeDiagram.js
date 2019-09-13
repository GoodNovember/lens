import { makeUniversalToolbox } from '../Parts/makeUniversalToolbox'
import { watchDirectory, read, write } from '../Utilities/file.js'
import path from 'path'
import standard from 'standard'

const acorn = require('acorn')
const astring = require('astring')

const readFileAsString = filePath => read({ filePath, options: { encoding: 'utf-8' } })
const writeAndParseFile = (filePath, rawStringData) => new Promise((resolve, reject) => {
  standard.lintText(rawStringData, {
    fix: true
  }, (error, results) => {
    if (error) {
      reject(error)
    } else {
      const parsed = results.results[0].output
      resolve(write({ filePath, data: parsed }))
    }
  })
})

export const makeDiagram = ({ directoryPath }) => {
  const universalToolbox = makeUniversalToolbox({
    width: 800,
    height: 550
  })

  watchDirectory({ directoryPath, options: { glob: '**/*.js' } })
    .then(({ watcher, files }) => {
      files.forEach((file) => {
        helloFile(file)
      })
      watcher.on('change', (fileName, directoryPath) => {
        const fullPath = path.join(directoryPath, fileName)
        updateFile(fullPath)
      })
      watcher.on('add', (fileName, directoryPath) => {
        const fullPath = path.join(directoryPath, fileName)
        helloFile(fullPath)
      })
      watcher.on('delete', (fileName, directoryPath) => {
        const fullPath = path.join(directoryPath, fileName)
        goodbyeFile(fullPath)
      })
    })

  function helloFile (filePath) {
    thinkAboutFile(filePath)
  }

  function goodbyeFile (filePath) {
    console.log('Goodbye:', filePath)
  }

  function updateFile (filePath) {
    console.log(`What's New?`, filePath)
    thinkAboutFile(filePath)
  }

  function thinkAboutFile (filePath) {
    readFileAsString(filePath).then(fileAsString => {
      const parsed = acorn.parse(fileAsString)
      const rawOutput = astring.generate(parsed)
      const { name, dir } = path.parse(filePath)
      const outputPath = path.join(dir, `${name}_parsed.hug`)
      visualize(filePath, parsed)
      // writeAndParseFile(outputPath, rawOutput).then(() => {
      //   console.log(`File Written:`, outputPath)
      // }).catch(error => {
      //   console.error(error)
      // })
    })
  }

  function visualize (filePath, parsed) {
    // console.log(`Would Visualize: ${filePath} ${parsed}`)
    console.clear()
    console.log(JSON.stringify(parsed, null, '  '))
  }

  return {
    ...universalToolbox
  }
}
