export const getImage = src => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = _event => {
    // console.log(`[image] loaded "${src}"`)
    resolve(image)
  }
  image.onerror = event => {
    reject(event)
  }
  image.onabort = event => {
    reject(event)
  }
  try {
    image.src = src
  } catch (error) {
    reject(error)
  }
})