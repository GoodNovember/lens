export const padMaker = padValue => count => {
  let output = ''
  for (let x = 0; x < count; x++) {
    output = `${output}${padValue}`
  }
  return output
}
