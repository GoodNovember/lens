import { parseDirectory } from './parseDirectory.js'
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
  const { container: directoryContainer } = parseDirectory('~/Downloads')

  container.addChild(directoryContainer)

  return {
    container
  }
}
