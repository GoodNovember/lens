// This little baby creates an array of calculated node data given an AST
// const { walk } = require('estree-walker')
import { walk } from 'estree-walker'

export const TexasRanger = ast => new Promise((resolve) => {
  let contextDepth = -1
  let previousDirection = ''
  let deepestDepth = 0
  let previousNode = null
  const rawRecords = []
  const rawParents = []
  function addRecord (record) {
    const { parentIndex, parentKey } = record
    const isWithinArray = typeof parentIndex === 'number'
    const isWithinObject = isWithinArray ? false : typeof parentKey === 'string'
    const compiledRecord = {
      ...record,
      isWithinArray,
      isWithinObject
    }
    const id = rawParents.map(({
      parentNode,
      parentParentNode,
      index,
      key
    }) => {
      if (parentParentNode) {
        if (typeof index === 'number') {
          return `.${key}[${index}]=${parentNode.type}`
        } else {
          return `.${key}=${parentNode.type}`
        }
      } else {
        return `${parentNode.type}`
      }
    }).join('')
    rawRecords.push({
      ...compiledRecord,
      id
    })
  }
  function eventEmitted (node, parentNode, parentKey, parentIndex, currentDirection) {
    const changedDirection = currentDirection !== previousDirection
    if (currentDirection === 'enter') {
      contextDepth++
      addRecord({
        node,
        parentNode,
        parentKey,
        parentIndex,
        currentDirection,
        contextDepth,
        previousDirection,
        changedDirection,
        previousNode
      })
    } else if (currentDirection === 'leave') {
      deepestDepth = Math.max(deepestDepth, contextDepth)
      addRecord({
        node,
        parentNode,
        parentKey,
        parentIndex,
        currentDirection,
        contextDepth,
        previousDirection,
        changedDirection,
        previousNode
      })
      contextDepth--
      if (node.type === 'Program') {
        const records = rawRecords.filter(item => item.currentDirection === 'enter').map(item => {
          const {
            changedDirection,
            currentDirection,
            previousDirection,
            previousNode,
            ...importantParts
          } = item
          return {
            ...importantParts
          }
        })
        resolve({ records, deepestDepth })
      }
    }
    previousDirection = currentDirection
    previousNode = node
  }

  walk(ast, {
    enter (node, parentNode, parentKey, parentIndex) {
      rawParents.push({ parentNode: node, parentParentNode: parentNode, key: parentKey, index: parentIndex })
      eventEmitted(node, parentNode, parentKey, parentIndex, 'enter')
    },
    leave (node, parentNode, parentKey, parentIndex) {
      rawParents.pop()
      eventEmitted(node, parentNode, parentKey, parentIndex, 'leave')
    }
  })
})
