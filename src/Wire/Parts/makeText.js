import { PIXI } from '../Utilities/localPIXI.js'

const { Text, TextStyle } = PIXI

const makeStyle = inputObj => new TextStyle(inputObj)

const makeTextWithStyle = ({ regularStyle, hoverStyle, activeStyle }) => string => {
  const textElement = new Text(string, regularStyle)
  textElement.interactive = true
  textElement.on('pointerdown', () => {
    if (activeStyle) {
      textElement.style = activeStyle
    }
  })
  textElement.on('pointerover', () => {
    if (hoverStyle) {
      textElement.style = hoverStyle
    }
  })
  textElement.on('pointerup', () => {
    textElement.style = regularStyle
  })
  textElement.on('pointerout', () => {
    if (regularStyle) {
      textElement.style = regularStyle
    }
  })
  return textElement
}

const fontFamily = `fira code`
const fontSize = 12

const WHITE = 0xFFFFFF
const BLACK = 0x000000
// const RED = 0xff0000
// const GREEN = 0x00ff00
// const BLUE = 0x0000ff
// const DARK_GREEN = 0x003300

const makeNormalText = makeTextWithStyle({
  regularStyle: makeStyle({ fill: WHITE, fontFamily, fontSize })
})

// const fileText = makeTextWithStyle({
//   regularStyle: makeStyle({ fill: BLUE, fontFamily, fontSize }),
//   hoverStyle: makeStyle({ fill: RED, fontFamily, fontSize }),
//   activeStyle: makeStyle({ fill: GREEN, fontFamily, fontSize })
// })

// const directoryText = makeTextWithStyle({
//   regularStyle: makeStyle({ fill: DARK_GREEN, fontFamily, fontSize }),
//   hoverStyle: makeStyle({ fill: RED, fontFamily, fontSize }),
//   activeStyle: makeStyle({ fill: GREEN, fontFamily, fontSize })
// })

export const makeText = string => {
  return makeNormalText(string)
}
