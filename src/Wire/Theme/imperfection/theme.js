import { processTexturePathMap } from '../common/processTexturePathMap.js'
import { PIXI } from '../../Utilities/localPIXI.js'

const { Texture, Sprite } = PIXI
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
import rope from './rope.png'

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
  rope
}

export const getTextures = () => new Promise((resolve, reject) => {
  processTexturePathMap(texturePathMap).then(resolve).catch(reject)
})

export default {
  name: 'Imperfection',
  getTextures
}