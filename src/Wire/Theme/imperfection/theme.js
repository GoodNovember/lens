import { processTexturePathMap } from '../common/processTexturePathMap.js'

// thanks Parcel.js!
import frameEmpty from './frame-empty.png'
import frameFull from './frame-full.png'

const texturePathMap = {
  frameEmpty,
  frameFull
}

const getTextures = () => new Promise((resolve, reject) => {
  processTexturePathMap(texturePathMap).then(resolve).catch(reject)
})


export default {
  name: 'Imperfection',
  getTextures
}