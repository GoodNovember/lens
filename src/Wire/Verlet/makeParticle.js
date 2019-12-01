export const makeParticle = ({
  verlayPoint,
  mass = 1,
  radius = 0,
  bounce = -1,
  friction = 1,
  gravity = 0
}) => {

  const distanceTo = otherPoint => {
    const dx = otherPoint.x - verlayPoint.x
    const dy = otherPoint.y - verlayPoint.y
    return Math.sqrt((dx * dx) + (dy * dy))
  }

  const gravitateTo = otherPoint => {
    const
  }

  return {
    distanceTo,

  }

}