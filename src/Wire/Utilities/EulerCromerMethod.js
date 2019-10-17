export const solve = ({ x, y, targetX, deltaX }) => {
  const output = []
  let localY = y
  let localX = x
  while (localX < targetX) {
    localY = localY + localY * deltaX
    localX = localX + deltaX
    output.push({ x: localX, y: localY })
  }
  return output
}
