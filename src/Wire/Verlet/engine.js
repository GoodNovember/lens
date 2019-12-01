import { distanceBetweenPoints } from './utilities.js'

const globalPoints = new Set()
const globalSticks = new Set()
const globalSprings = new Set()

const fictionalTop = -Infinity
const fictionalLeft = -Infinity
const fictionalRight = Infinity
const fictionalBottom = Infinity

const pointBounce = 0.9

const gravity = 0.9
const friction = 0.999999 // (0.99999 = slick) (1.0 = no friction) (0.9 = stiff)
const loopCount = 30 // the higher, the more stable the simulation is, the lower, the quicker it is.

const minThreshhold = 0.001

const updatePoints = ({ deltaTime }) => {
  for (const point of globalPoints.values()) {
    if (point.isPinned) {
      continue
    }
    const { vector } = point
    const vectorWithFriction = vector.multiply(friction)
    if (Math.abs(vectorWithFriction.x) < minThreshhold) {
      vectorWithFriction.x = 0
    }
    if (Math.abs(vectorWithFriction.y) < minThreshhold) {
      vectorWithFriction.y = 0
    }
    point.oldX = point.x
    point.oldY = point.y
    point.x += vectorWithFriction.x
    point.y += vectorWithFriction.y
    point.y += gravity
  }
}

const updateSticks = ({ deltaTime }) => {
  for (const stick of globalSticks.values()) {
    const { pointA, pointB, length } = stick
    const dx = pointB.x - pointA.x
    const dy = pointB.y - pointA.y
    const distance = distanceBetweenPoints({ pointA, pointB })
    const difference = length - distance
    const percent = difference / distance / 2
    let offsetX = dx * percent
    let offsetY = dy * percent
    if (Math.abs(offsetX) < minThreshhold) {
      offsetX = 0
    }
    if (Math.abs(offsetY) < minThreshhold) {
      offsetY = 0
    }
    if (pointA.isPinned === false) {
      stick.pointA.x -= offsetX
      stick.pointA.y -= offsetY
    }
    if (pointB.isPinned === false) {
      stick.pointB.x += offsetX
      stick.pointB.y += offsetY
    }
    stick.recalculate()
  }
}

const updateSprings = ({ deltaTime }) => {
  for (const spring of globalSprings.values()) {
    const { pointA, pointB, friction = 0.9, stiffness, line } = spring
    // const springConstant = 0.2
    const distance = distanceBetweenPoints({ pointA, pointB })

    const vx = pointA.x - pointA.oldX
    const vy = pointA.y - pointA.oldY
    // const distanceVector = pointA.vector.subtract(pointB.vector).multiply(stiffness)//.multiply(springConstant).multiply(friction)
    pointA.oldX = pointA.x
    pointA.oldY = pointB.y
    // pointA.x = distanceVector.x
    // pointA.y = distanceVector.y
    pointA.x += vx * distance * stiffness
    pointA.y += vy * distance * stiffness
    // spring.recalculate()
  }
}

const constrainPoints = () => {
  for (const point of globalPoints.values()) {
    if (point.isPinned) {
      continue
    }
    const { vector } = point
    const vectorWithFriction = vector.multiply(friction)

    if (point.x > fictionalRight) {
      point.x = fictionalRight
      point.oldX = point.x + (vectorWithFriction.x * pointBounce)
    } else if (point.x < fictionalLeft) {
      point.x = fictionalLeft
      point.oldX = point.x + (vectorWithFriction.x * pointBounce)
    }

    if (point.y > fictionalBottom) {
      point.y = fictionalBottom
      point.oldY = point.y + (vectorWithFriction.y * pointBounce)
    } else if (point.y < fictionalTop) {
      point.y = fictionalTop
      point.oldY = point.y + (vectorWithFriction.y * pointBounce)
    }
  }
}

export const updatePhysics = (payload) => {
  updatePoints(payload)
  updateSprings(payload)
  for (let i = 0; i < loopCount; i++) {
    updateSticks(payload)
    constrainPoints(payload)
  }
}

export const hookupPointPhysics = pointInstance => {
  globalPoints.add(pointInstance)
  return () => {
    globalPoints.delete(pointInstance)
  }
}

export const hookupStickPhysics = stickInstance => {
  globalSticks.add(stickInstance)
  return () => {
    globalSticks.delete(stickInstance)
  }
}

export const hookupSpringPhysics = springInstance => {
  globalSprings.add(springInstance)
  return () => {
    globalSprings.remove(springInstance)
  }
}