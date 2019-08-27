import { parseDirectory } from './Old/parseDirectory.js/index.js'
import { directoryLens } from './Old/directoryLens.js/index.js'
import { makeStringPrimitive } from './Old/makeStringPrimitive.js/index.js'
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

  stringPrimitive.subscribeToValueChange(newValue => {
    console.log(`Value: ${newValue}`)
    const newLens = directoryLens({ directory: newValue })
    if (activeLens) {
      container.removeChild(activeLens)
    }
    activeLens = newLens.container
    container.addChild(newLens.container)
  })

  container.addChild(stringPrimitive.container)

  return {
    container
  }
}
