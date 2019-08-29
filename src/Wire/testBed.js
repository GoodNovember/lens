import { parseDirectory } from './parseDirectory.js'
import { directoryLens } from './directoryLens.js'
import { makeStringPrimitive } from './makeStringPrimitive.js'
import * as PIXI from 'pixi.js-legacy'

global.PIXI = PIXI
require('pixi-layers')

const {
  display
  // Graphics
} = PIXI

const {
  Layer
  // Stage
} = display

export const testBed = () => {
  const container = new Layer()

  // const { container: directoryContainer } = parseDirectory('/Users/victor/Desktop')
  // const { container: directoryContainer } = parseDirectory('~/Downloads')

  const stringPrimitive = makeStringPrimitive({ value: '~/Downloads', x: 10, y: 10 })

  let activeLens = null

  const dLens = directoryLens({ directory: `~/Downloads` })

  container.addChild(dLens.container)

  stringPrimitive.subscribeToValueChange(newValue => {
    console.log(`Value: ${newValue}`)
    dLens.directory = newValue
  })

  container.addChild(stringPrimitive.container)

  return {
    container
  }
}
