## Program
A program is the root element of the AST. There should only be one per parsed file.
From Acorn, we get this:

```js
{
  type: "Program",
  sourceType: "Script"
  body:[]
}
```

The body contains our program elements which should be found below.

## Expression Statement

These are connectors that hold onto statements.

```js
{
  type: "ExpressionStatement",
  expression:{}
}
```

## Call Expression

This is what is done when we Call a function. Notice it has a Callee, which is the thing that is being called. and it also has an Array of Arguments

```js
{
  type:"CallExpression",
  callee:{},
  arguments:[]
}
```

## Member Expression

Hey, want to talk about something specific on an object? use one of these.

```js
{
  type: "MemberExpression",
  object: {},
  property: {},
  computed: Boolean
}
```

## Identifier
```js
{
  type: "Identifier",
  name: String // for console.log(), both "console" and "log" are identifiers.
}
```

## Literal
```js
{
  type: "Literal",
  value: // The value that the computer sees,
  raw: // the value as it was written
}
```

## Literal (regex)
```js
{
  type: "Literal",
  value:{} // The value that the computer sees,
  raw: String //the entire regex as written
  regex:{ // only included with regex stuff
    pattern: String, // the internal part of the regex
    flags: String // after the last slash
  }
}
```

## Function Declaration
```js
{
  type:"FunctionDeclaration",
  id: Identifier,
  expression: Boolean,
  generator: Boolean,
  async: Boolean,
  params: [Identifiers, ObjectPattern],
  body:[]
}
```

## Return Statement
```js
{
  type:"ReturnStatement",
  argument: Identifier
}
```

## Debugger Statement
```js
{
  type:"DebuggerStatement"
}
```

## Variable Declaration
```js
{
  type:"VariableDeclaration",
  kind: "const" || "let" || "var"
  declarations:[ VariableDeclarator ]
}
```

## Variable Declarator
```js
{
  type:"VariableDeclarator",
  id: Identifier,
  init: Literal || Identifier
}
```

## New Expression
```js
{
  type: "NewExpression",
  callee: Identifier,
  arguments: []
}
```

## Assignment Expression
When you want to change what a variable of some sort contains, use this lil baby
```js
{
  type:"AssignmentExpression"
  operator: "=" || "-=" || "+=" || "*=" || "/=",
  left: Identifier,
  right: Literal || Identifier
}
```

## Update Expression
```js
{
  type: "UpdateExpression",
  operator: "++" || "--",
  prefix: Boolean, // true if is (++Variable) false if (Variable++)
  argument: Identifier
}
```

## Binary Expression
```js
{
  type: "BinaryExpression",
  operator: "+" || "-" || "/" || "*",
  left: Identifier || Literal || Expression,
  right: Identifier || Literal || Expression,
}
```

## Template Literal
Quasis means the strings that interleave each of the expressions. If you use expressions, there will always be a Quasis before and after it. If no expressions, then there is only one Quasis. There may be a Quasis that is a string of zero length, but there will always be a quasis between two expressions.

```js
{
  type: "Template Literal",
  expressions: [ Expression || Literal ],
  quasis:[]
}
```

## Template Element
```js
{
  type: "TemplateElement",
  value: {
    raw: "",
    cooked: ""
  },
  tail: Boolean // only the last element in the array is true.
}
```

## Block Statement
```js
{
  type:"BlockStatement",
  body:[
    // expressions
  ]
}
```

## For Statement

```js
{
  type:"ForStatement",
  init:{
    // variable declaration
  },
  test:{
    // binary expression
  },
  update:{
    // update expression
  },
  body:{
    // block statement
  }
}
```

## While Statement
```js
{
  type:"WhileStatement",
  test:{
    // literal or expression
  },
  body:{
    // block statement
  }
}
```

## Do While Statement
```js
{
  type:"DoWhileStatement",
  test:{
    //literal or expression
  },
  body:{
    //block statement
  }
}
```

## Property
These live inside an Object Expression
```js
{
  type:"Property",
  method: Boolean,
  shorthand: Boolean, // true if { hello } false if { hello:hello }
  computed: Boolean,
  key:{
    //Identifier
  },
  kind: "init" || "get" || "set", // init if not get or set
  value: {
    // stuff, Identifiers and such, if get or set it is likely a Function Expression
  }
}
```

## Object Expression
Lets build an object together!
```js
{
  type:"Object Expression",
  properties:[
    // properties
  ]
}
```

## Object Pattern
```js
{
  type: "ObjectPattern",
  properties:[
    // properties
  ]
}
```

## This Expression
```js
{
  type:"ThisExpression"
}
```

## Try Statement
```js
{
  type: "TryStatement",
  block:{
    // block statement
  },
  handler:{
    type:"CatchClause",
    param:{
      //identifier
    },
    body:{
      // block statement
    }
  },
  finalizer: null || {
    // block statement
  }
}
```

## SwitchStatement
```js
{
  type:"SwitchStatement"
  discriminant:{
    // identifier
  },
  cases:[
    //switchCases
  ]
}
```

## SwitchCase
```js
{
  type:"SwitchCase",
  consequent:[
    // block statements???
  ],
  test:{
    // literal or expression
  }
}
```

## BreakStatement
```js
{
  type:"BreakStatement",
  label:null || // possible to use, but its bad practice to use labels, I guess.
}
```

## Labeled Statement
```js
{
  type:"LabeledStatement",
  body:{
    // block statement
  },
  label:{
    // identifier
  }
}
```

## Array Expression
```js
{
  type:"ArrayExpression",
  elements:[
    // Literals
  ]
}
```

## Throw Statement
```js
{
  type:"ThrowStatement",
  argument:{
    // expression
  }
}
```

## For In Statement
```js
{
  type:"ForInStatement",
  left:{
    // Variable declaration
  },
  right:{
    // identifier
  },
  body:{
    // block statement
  }
}
```

## For Of Statement
```js
{
  type:"ForOfStatement",
  await: Boolean, // yep, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
  left:{
    // Variable declaration
  },
  right:{
    // identifier
  },
  body:{
    // block statement
  }
}
```

## Empty Statement
```js
{
  type:"EmptyStatement"
}
```

## Class Declaration
```js
{
  type:"ClassDeclaration",
  id:{
    // identifier
  },
  superClass: null || Identifier
  body:{
    type: "ClassBody",
    body:[]
  }
}
```

## Class With Constructor
```js
{
  type:"ClassDeclaration",
  id:{
    // identifier
  },
  superClass: null || Identifier
  body:{
    type: "ClassBody",
    body:[
      {
        type: "MethodDefinition",
        kind: "constructor"
        static: Boolean,
        computed: Boolean,
        key: {
          // identifier
        },
        value:{
          // function expression
        }
      }
    ]
  }
}
```

## Import Declaration
```js
{
  type:"ImportDeclaration",
  specifiers:[
    {
      type: "ImportSpecifier",
      imported: {
        // identifier
      },
      local:{
        // identifer // may be the same as above.
      }
    }
  ],
  source:{
    // string literal
  }
}
```

## Export Named Declaration
```js
{
  type: "ExportNamedDeclaration",
  declaration:{
    //"VariableDeclaration"
  },
  specifiers:[],
  source: null,
}
```


```js
{
  type: "ExportSpecifier",
  local: {
    // identifier
  },
  exported: {
    // identifier
  }
}
```

## RestElement
```js
{
  type:"RestElement",
  argument:{
    // identifier
  }
}
```

## Arrow Function Expression
```js
{
  type: 'ArrowFunctionExpression',
  id :null || Identifier,
  expression: Boolean,
  generator: Boolean,
  async: Boolean,
  params:[
    //stuff
  ],
  body:{
    // block Statement or Call Statement.
  }
}
```

```js
const log = (...stuff) => { console.log(...stuff) } // uses a block statement for the body.
const log2 = (...stuff) => console.log(...stuff) // uses a call statement for the body.
```