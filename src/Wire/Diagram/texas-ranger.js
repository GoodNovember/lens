// Useful for when a simple walker is not enough
// const walk = require('acorn-walk')

const { walk } = require('estree-walker')

const padMaker = padValue => count => {
  let output = ''
  for (let x = 0; x < count; x++) {
    output = `${output}${padValue}`
  }
  return output
}

const tabPad = padMaker('  ')

export const TexasRanger = ast => new Promise((resolve, reject) => {
  let contextDepth = 0
  let currentAction = ''
  let previousNode = null
  let deepestDepth = 0

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
    deepestDepth = Math.max(deepestDepth, contextDepth)
    contextDepth--
    if (currentAction !== 'leave') {
      currentAction = 'leave'
      ejections.push(previousNode)
      console.log(`Eject: ${tabPad(contextDepth)} ${node.type}`)
    } else {
      console.log(`eject: ${tabPad(contextDepth)} ${node.type}`)
    }
    previousNode = node

    // A Full Walk will always conculde with the Leaving of the program.
    // As a side note, it also starts with entering the program.
    if (node.type === 'Program') {
      resolve({
        ejections,
        deepestDepth
      })
    }
  }
  walk(ast, { enter, leave })
})
