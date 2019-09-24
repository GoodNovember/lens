const { walk } = require('estree-walker')
const padMaker = padValue => count => {
  let output = ''
  for (let x = 0; x < count; x++) {
    output = `${output}${padValue}`
  }
  return output
}
const tabPad = padMaker('\t')
export const TexasRanger = ast => new Promise((resolve, reject) => {
  let contextDepth = 0
  let currentAction = ''
  let previousNode = null
  const ejections = []
  function enter (node, parentNode, parentKey, parentIndex) {
    if (currentAction !== 'enter') {
      currentAction = 'enter'
      console.log(`Enter: ${tabPad(contextDepth)} ${node.type}`)
    } else {
      console.log(`enter: ${tabPad(contextDepth)} ${node.type}`)
    }
    previousNode = node
    contextDepth++
  }
  function leave (node, parentNode, parentKey, parentIndex) {
    if (currentAction !== 'leave') {
      currentAction = 'leave'
      ejections.push({
        ...previousNode
      })
      console.log(`Eject: ${tabPad(contextDepth)} ${node.type}`)
    } else {
      console.log(`eject: ${tabPad(contextDepth)} ${node.type}`)
    }
    previousNode = node
    contextDepth--
    if (node.type === 'Program') {
      resolve({
        ejections
      })
    }
  }
  walk(ast, {
    enter,
    leave
  })
})
