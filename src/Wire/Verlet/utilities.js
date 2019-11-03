export const distanceBetweenPoints = ({ pointA, pointB }) => {
  return Math.sqrt(((pointB.x - pointA.x) * (pointB.x - pointA.x)) + ((pointB.y - pointA.y) * (pointB.y - pointA.y)))
}