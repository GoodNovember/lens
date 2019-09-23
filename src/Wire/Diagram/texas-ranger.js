// Useful for when a simple walker is not enough
// const walk = require('acorn-walk')

const { walk } = require('estree-walker')

// one must now learn how they are being used.

const subPositionsByType = {
  MemberExpression: {
    objects: ['object', 'property'],
    arrays: []
  }
}

export const TexasRanger = ast => {
  const output = []
  let counter = 0
  walk(ast, {
    enter: function (node, parentNode, parentKey, parentIndex) {
      const isPartOfArray = typeof parentIndex === 'number'
      if (isPartOfArray) {
        if (parentNode) {
          console.log(`${counter} enter A ${parentNode.type}.${parentKey}[${parentIndex}] = ${node.type}`)
        } else {
          console.log(`${counter} enter - ${node.type}`)
        }
      } else {
        if (parentNode) {
          console.log(`${counter} enter O ${parentNode.type}.${parentKey} = ${node.type}`)
        } else {
          console.log(`${counter} enter P ${node.type}`)
        }
      }
      counter++
    },
    leave: function (node, parentNode, parentKey, parentIndex) {
      const isPartOfArray = typeof parentIndex === 'number'
      if (isPartOfArray) {
        if (parentNode) {
          console.log(`${counter} leave A ${parentNode.type}.${parentKey}[${parentIndex}] = ${node.type}`)
        } else {
          console.log(`${counter} leave - ${node.type}`)
        }
      } else {
        if (parentNode) {
          console.log(`${counter} leave O ${parentNode.type}.${parentKey} = ${node.type}`)
        } else {
          console.log(`${counter} leave P ${node.type}`)
        }
      }
      counter++
    }
  })
  return output
}
