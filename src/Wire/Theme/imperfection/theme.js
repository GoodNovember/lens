import { processTexturePathMap } from '../common/processTexturePathMap.js'
import { PIXI } from '../../Utilities/localPIXI.js'
// thanks Parcel.js!
import frameEmpty from './frame-empty.png'
import frameFull from './frame-full.png'

import jackConnector from './jack-connector.png'
import jackDetune from './jack-detune.png'
import jackFrequency from './jack-frequency.png'
import jackType from './jack-type.png'
import jackStart from './jack-start.png'
import jackStop from './jack-stop.png'
import jackGain from './jack-gain.png'
import jackTrigger from './jack-trigger.png'
import jackZeroToOne from './jack-0-1.png'
import jackNumber from './jack-number.png'
import jackString from './jack-string.png'
import rope from './rope.png'

const { Texture, Sprite } = PIXI

const texturePathMap = {
  frameEmpty,
  frameFull,
  jackConnector,
  jackDetune,
  jackFrequency,
  jackType,
  jackStart,
  jackStop,
  jackGain,
  jackTrigger,
  jackZeroToOne,
  jackNumber,
  jackString,
  rope
}

export const getTextures = () => new Promise((resolve, reject) => {
  processTexturePathMap(texturePathMap).then(resolve).catch(reject)
})

export default {
  name: 'Imperfection',
  getTextures,
  oscillatorColor: 0x0fff0f,
  gainColor: 0xbabaff
}
