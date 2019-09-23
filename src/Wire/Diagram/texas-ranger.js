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
  walk(ast, {
    enter: function (node, parentNode, parentKey, parentIndex) {
      const isPartOfArray = typeof parentIndex === 'number'
      if (isPartOfArray) {
        if (parentNode) {
          console.log(`enter A ${parentNode.type}.${parentKey}[${parentIndex}] = ${node.type}`)
        } else {
          console.log(`enter - ${node.type}`)
        }
      } else {
        if (parentNode) {
          console.log(`enter O ${parentNode.type}.${parentKey} = ${node.type}`)
        } else {
          console.log(`enter P ${node.type}`)
        }
      }
    },
    leave: function (node, parentNode, parentKey, parentIndex) {
      const isPartOfArray = typeof parentIndex === 'number'
      if (isPartOfArray) {
        if (parentNode) {
          console.log(`leave A ${parentNode.type}.${parentKey}[${parentIndex}] = ${node.type}`)
        } else {
          console.log(`leave - ${node.type}`)
        }
      } else {
        if (parentNode) {
          console.log(`leave O ${parentNode.type}.${parentKey} = ${node.type}`)
        } else {
          console.log(`leave P ${node.type}`)
        }
      }
    }
  })
  return output
}
