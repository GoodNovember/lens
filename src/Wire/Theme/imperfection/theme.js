import { processTexturePathMap } from '../common/processTexturePathMap.js'

// thanks Parcel.js!
import frameEmpty from './frame-empty.png'
import frameFull from './frame-full.png'

import jackConnector from './jack-connector.png'
import jackDetune from './jack-detune.png'
import jackFrequency from './jack-frequency.png'
import jackType from './jack-type.png'
import jackStart from './jack-start.png'
import jackStop from './jack-stop.png'

const texturePathMap = {
  frameEmpty,
  frameFull,
  jackConnector,
  jackDetune,
  jackFrequency,
  jackType,
  jackStart,
  jackStop
}

const getTextures = () => new Promise((resolve, reject) => {
  processTexturePathMap(texturePathMap).then(resolve).catch(reject)
})

export default {
  name: 'Imperfection',
  getTextures
}