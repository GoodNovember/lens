import { PIXI } from '../../Utilities/localPIXI.js'

const { Texture, Sprite } = PIXI
import { getImage } from './getImage.js'
export const processTexturePathMap = async texturePathMap => {
  const keys = Object.keys(texturePathMap)
  const promises = keys.map(key => {
    const imagePath = texturePathMap[key]
    return getImage(imagePath).then(image => {
      const texture = Texture.from(image)
      const makeSprite = () => {
        const sprite = new Sprite(texture)
        return sprite
      }
      return {
        texture,
        makeSprite,
        key,
        image,
      }
    }).catch(error => {
      console.error(`getImage('${imagePath}') error from within 'processTexturePathMap()'`, error)
    })
  })
  const results = await Promise.all(promises)
  return results.reduce((acc, { key, ...rest }) => {
    return {
      ...acc,
      [key]: { ...rest }
    }
  }, {})
}