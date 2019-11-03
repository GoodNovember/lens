import { distanceBetweenPoints } from './utilities.js'

const globalPoints = new Set()
const globalSticks = new Set()

const fictionalTop = -Infinity
const fictionalLeft = -Infinity
const fictionalRight = Infinity
const fictionalBottom = Infinity

const pointBounce = 0.9

const gravity = 0.25
const friction = .99 // (0.99999 = slick) (1.0 = no friction) (0.9 = stiff)
const loopCount = 10

const minThreshhold = 0.001

const updatePoints = ({ deltaTime }) => {
  for (const point of globalPoints.values()) {
    if (point.isPinned) {
      continue
    }
    let vx = (point.x - point.oldX) * friction
    let vy = (point.y - point.oldY) * friction
    if (Math.abs(vx) < minThreshhold) {
      vx = 0
    }
    if (Math.abs(vy) < minThreshhold) {
      vy = 0
    }
    point.oldX = point.x
    point.oldY = point.y
    point.x += vx
    point.y += vy
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

const constrainPoints = () => {
  for (const point of globalPoints.values()) {
    if (point.isPinned) {
      continue
    }
    const vx = (point.x - point.oldX) * friction
    const vy = (point.y - point.oldY) * friction

    if (point.x > fictionalRight) {
      point.x = fictionalRight
      point.oldX = point.x + (vx * pointBounce)
    } else if (point.x < fictionalLeft) {
      point.x = fictionalLeft
      point.oldX = point.x + (vx * pointBounce)
    }

    if (point.y > fictionalBottom) {
      point.y = fictionalBottom
      point.oldY = point.y + (vy * pointBounce)
    } else if (point.y < fictionalTop) {
      point.y = fictionalTop
      point.oldY = point.y + (vy * pointBounce)
    }
  }
}

export const updatePhysics = (payload) => {
  updatePoints(payload)
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