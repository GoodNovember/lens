import { PIXI } from './localPIXI.js'

const {
  Graphics,
  Texture,
  Circle,
  Sprite,
  RenderTexture
} = PIXI

const textureArchive = new Map()

const makeCircleTexture = ({x,y,radius, innerRadius= 0}) => {
  const cvs = document.createElement('canvas')
  const ctx = cvs.getContext('2d')
  cvs.width = radius * 2
  cvs.height = radius * 2
  ctx.beginPath()
  ctx.fillStyle = '#444'
  ctx.arc(radius,radius,radius,0,Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.fillStyle = 'white'
  ctx.arc(radius,radius,radius - 1,0,Math.PI * 2)
  ctx.fill()
  if(innerRadius > 0){
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.arc(radius,radius,innerRadius,0,Math.PI * 2)
    ctx.fill()
  }
  return Texture.from(cvs)
}

export const makeCircle = ({ 
  x, 
  y,
  innerRadius, 
  radius 
}) => {
  const id = `circle ${x} ${y} ${radius}`
  // let tex = null
  // if(textureArchive.has(id) == false){
  const tex = makeCircleTexture({ x, y, radius, innerRadius })
  //   textureArchive.set(id, tex)
  // }else{
  //   tex = textureArchive.get(id)
  // }
  if(tex){
    const circleSprite = new Sprite(tex)
    // circleSprite.x = x
    // circleSprite.y = y
    // circleSprite.hitArea = new Circle(radius, x, y)
    circleSprite.interactive = true
    circleSprite.anchor.set(0.5)
    return circleSprite
  }else{
    return null
  }
}