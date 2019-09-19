import { makeUniversalToolbox } from '../Parts/makeUniversalToolbox'
import { watchDirectory, read, write } from '../Utilities/file.js'
import path from 'path'
import standard from 'standard'

const acorn = require('acorn')
const astring = require('astring')

const readFileAsString = filePath => read({ filePath, options: { encoding: 'utf-8' } })
const lintCodeString = stringData => new Promise((resolve, reject) => {
  standard.lintText(stringData, { fix: true }, (error, results) => {
    if (error) {
      reject(error)
    } else {
      resolve(results)
    }
  })
})
const convertFileStringToAst = fileString => acorn.parse(fileString, { sourceType: 'module' })

const lintAndWriteFile = (filePath, rawStringData) => lintCodeString(rawStringData)
  .then(({
    results,
    errorCount,
    fixableErrorCount,
    fixableWarningCount,
    usedDepreciatedRules,
    warningCount
  }) => {
    const { output } = results[0]
    if (output) {
      return write({ filePath, data: output }).then(() => {
        return output
      })
    } else {
      console.error(results)
      return Promise.reject(new Error('No File Written, No Output from Linter.'))
    }
  })

const compileJavascriptFromAST = ast => astring.generate(ast)

export const makeDiagram = ({ directoryPath }) => {
  const universalToolbox = makeUniversalToolbox({
    width: 800,
    height: 550
  })

  watchDirectory({ directoryPath, options: { glob: '**/*.target.js' } })
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
    console.log('What\'s New?', filePath)
    thinkAboutFile(filePath)
  }

  function thinkAboutFile (filePath) {
    readFileAsString(filePath).then(fileAsString => {
      const parsedAST = convertFileStringToAst(fileAsString)
      const { name, dir } = path.parse(filePath)
      const rawGeneratedJavascriptString = compileJavascriptFromAST(parsedAST)
      const outputPath = path.join(dir, `${name}_parsed.js`)
      visualize(filePath, parsedAST)
      lintAndWriteFile(outputPath, rawGeneratedJavascriptString)
        .then(writtenData => {
          console.log(`File Written: ${outputPath}`)
          console.log(writtenData)
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  function visualize (filePath, parsed) {
    console.log(`Would Visualize: ${filePath} ${parsed}`)
    console.clear()
    console.log(JSON.stringify(parsed, null, '  '))
  }

  return {
    ...universalToolbox
  }
}
