// Useful for when a simple walker is not enough
const stack = []

const isFunction = test => typeof test === 'function'

const astTypeMap = {
  Program (item, parent, addToQueue) {
    // Programs have a body.
    const { body } = item
    console.log('Found a Program')
    if (Array.isArray(body)) {
      body.forEach(bodyItem => addToQueue(bodyItem, item))
    } else {
      console.log('Body Not Array')
    }
  },
  Identifier (item, parent, addToQueue) {
    const { name } = item
    console.log('ID', name)
  },
  VariableDeclarator (item, parent, addToQueue) {
    const { id, init } = item
    addToQueue(id, item)
    addToQueue(init, item)
  },
  VariableDeclaration (item, parent, addToQueue) {
    const { declarations, kind } = item
    console.log(`Declaring a ${kind} Variable!`)
    if (Array.isArray(declarations)) {
      declarations.forEach(declaration => addToQueue(declaration, item))
    } else {
      console.log('Declarations Not an array?')
    }
  },
  FunctionDeclaration (item, parent, addToQueue) {
    const {
      id,
      expression,
      body,
      generator,
      params
    } = item
    if (id) {
      addToQueue(id, item)
    }
    addToQueue(body, item)
    if (Array.isArray(params)) {
      params.forEach(paramItem => addToQueue(paramItem, item))
    } else {
      console.log('Params not an array?')
    }
  },
  BlockStatement (item, parent, addToQueue) {
    const { body } = item
    if (Array.isArray(body)) {
      body.forEach(bodyItem => addToQueue(bodyItem, parent))
    } else {
      console.error('Body not an array?')
    }
    addToQueue()
  },
  ReturnStatement (item, parent, addToQueue) {
    const { argument } = item
    if (argument) {
      addToQueue(argument, item)
    }
  },
  RestElement (item, parent, addToQueue) {
    const { argument } = item
    if (argument) {
      addToQueue(argument, item)
    }
  },
  CallExpression (item, parent, addToQueue) {
    const { callee, arguments: args } = item
    if (Array.isArray(args)) {
      args.forEach(argItem => addToQueue(argItem, item))
    }
    if (callee) {
      addToQueue(callee, item)
    }
  },
  ExpressionStatement (item, parent, addToQueue) {
    // console.log('Expression Statement', item)
    const { expression } = item
    if (expression) {
      addToQueue(expression, item)
    }
  },
  MemberExpression (item, parent, addToQueue) {
    const { object, property, computed } = item
    if (object) {
      addToQueue(object, item)
    }
    if (property) {
      addToQueue(property, item)
    }
  },
  SpreadElement (item, parent, addToQueue) {
    const { argument } = item
    if (argument) {
      addToQueue(argument, item)
    }
  },
  ArrowFunctionExpression (item, parent, addToQueue) {
    const {
      async,
      expression,
      generator,
      body,
      id,
      params
    } = item
    if (Array.isArray(params)) {
      params.forEach(paramItem => addToQueue(paramItem, item))
    }
    if (id) {
      addToQueue(id, item)
    }
    if (body) {
      addToQueue(body, item)
    }
  }
}

export const TexasRanger = ast => {
  const addToQueue = (item, parent) => {
    if (stack.length > 0) {
      stack.forEach(item => {
        stack.shift()()
      })
    }
    if (item) {
      const { type } = item
      if (isFunction(astTypeMap[type])) {
        stack.push(() => {
          astTypeMap[type](item, parent, addToQueue)
        })
      } else {
        console.log('Not Supported Yet:', type)
      }
    }
  }
  const processItem = item => {
    const { type } = item
    if (typeof astTypeMap[type] === 'function') {
      astTypeMap[type](item, null, addToQueue)
    }
  }
  processItem(ast)
  return {
    texas: 'ranger',
    uhh: 'What\'s up?'
  }
}
