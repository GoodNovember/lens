import { distanceBetweenPoints } from './utilities.js'

const globalPoints = new Set()
const globalSticks = new Set()

const fictionalTop = -Infinity
const fictionalLeft = -Infinity
const fictionalWidth = Infinity
const fictionalHeight = Infinity

const pointBounce = 0.9

const gravity = 0.5
const friction = 1.001
const loopCount = 10

const updatePoints = ({ deltaTime }) => {
  for (const point of globalPoints.values()) {
    if (point.isPinned) {
      continue
    }
    const vx = (point.x - point.oldX) * friction
    const vy = (point.y - point.oldY) * friction
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
    const offsetX = dx * percent
    const offsetY = dy * percent
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

    if (point.x > fictionalWidth) {
      point.x = fictionalWidth
      point.oldX = point.x + (vx * pointBounce)
    } else if (point.x < fictionalLeft) {
      point.x = fictionalLeft
      point.oldX = point.x + (vx * pointBounce)
    }

    if (point.y > fictionalHeight) {
      point.y = fictionalHeight
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