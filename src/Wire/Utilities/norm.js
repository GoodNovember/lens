// returns a value between 0 and 1 that coresponds to where the
// value lives between the min and max.
export const norm = ({ min, max, value }) => {
  const calcMin = Math.min(min, max)
  const calcMax = Math.max(min, max)
  return (value - calcMin) / (calcMax - calcMin)
}
