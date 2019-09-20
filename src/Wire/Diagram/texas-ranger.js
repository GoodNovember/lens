// Useful for when a simple walker is not enough
const walk = require("acorn-walk")
const stack = []

const isFunction = test => typeof test === 'function'


export const TexasRanger = ast => {
  walk.fullAncestor(ast, (node, state, base, type)=>{
    // const {type} = node
    console.groupCollapsed(type)
    console.log(JSON.stringify({node, state, base, type}, null, '  '))
    console.groupEnd(type)
  })
}
