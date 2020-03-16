import { processTexturePathMap } from '../common/processTexturePathMap.js'

// thanks Parcel.js!
import frameEmpty from './images/frame-empty.png'
import frameFull from './images/frame-full.png'

import jackConnector from './images/jack-connector.png'
import jackDetune from './images/jack-detune.png'
import jackFrequency from './images/jack-frequency.png'
import jackType from './images/jack-type.png'
import jackStart from './images/jack-start.png'
import jackStop from './images/jack-stop.png'
import jackGain from './images/jack-gain.png'
import jackTrigger from './images/jack-trigger.png'
import jackZeroToOne from './images/jack-0-1.png'
import jackNumber from './images/jack-number.png'
import jackString from './images/jack-string.png'
import jackRecord from './images/jack-record.png'
import rope from './images/rope.png'

import './fonts.css'

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
  jackRecord,
  rope
}

export const getTextures = () => Promise.resolve(processTexturePathMap(texturePathMap))

export default {
  name: 'Imperfection',
  getTextures,
  oscillatorColor: 0x0fff0f,
  gainColor: 0xbabaff,
  destinationColor: 0xffff00,
  analyserColor: 0xeaffff,
  recorderColor: 0xffbbaa
}
