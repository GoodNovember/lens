import { PIXI } from './localPIXI.js'

const {
  Texture,
  Sprite,
} = PIXI

const makeCircleTexture = ({
  radius, 
  innerRadius = 0, 
  borderThickness = 0,
  borderFillStyle = 'black',
  innerFillStyle = 'white'
}) => {
  const cvs = document.createElement('canvas')
  
  cvs.width = radius * 2
  cvs.height = radius * 2
  
  const ctx = cvs.getContext('2d')

  ctx.beginPath()
  ctx.fillStyle = `${borderFillStyle}`
  ctx.arc(radius, radius, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.fillStyle = `${innerFillStyle}`
  ctx.arc(radius, radius, radius - borderThickness, 0, Math.PI * 2)
  ctx.fill()
  
  if(innerRadius > 0){
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.arc(radius, radius, innerRadius, 0, Math.PI * 2)
    ctx.fill()
  }
  
  return Texture.from(cvs)
}

export const makeCircle = ({ 
  x, 
  y,
  radius,
  innerRadius = 0, 
  borderThickness = 0,
  borderFillStyle = 'black',
  innerFillStyle = 'white'
}) => {
  const tex = makeCircleTexture({ 
    radius, 
    innerRadius,
    borderThickness,
    borderFillStyle,
    innerFillStyle
  })
  const circleSprite = new Sprite(tex)
  circleSprite.x = x
  circleSprite.y = y
  circleSprite.interactive = true
  circleSprite.anchor.set(0.5)
  return circleSprite
}