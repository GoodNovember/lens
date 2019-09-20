// this file has some abstracted object makers that can be used by code to write code.

export const Identifier = nameString => ({
  type: 'Identifier',
  name: nameString
})

export const Literal = ({ value, raw, regex }) => ({
  type: 'Literal',
  value,
  raw,
  regex
})

export const StringLiteral = stringValue => Literal({
  value: stringValue,
  raw: `'${stringValue}'`
})

export const NumberLiteral = numberValue => Literal({
  value: numberValue,
  raw: `${numberValue}`
})

export const BooleanLiteral = boolValue => Literal({
  value: boolValue,
  raw: `${boolValue}`
})

export const TrueLiteral = BooleanLiteral(true)
export const FalseLiteral = BooleanLiteral(false)

export const NullLiteral = Literal({
  value: null,
  raw: 'null'
})

export const UndefinedLiteral = Literal({
  value: undefined,
  raw: 'undefined'
})

export const Program = body => ({
  type: 'Program',
  sourceType: 'module',
  body
})

export const Module = body => ({
  type: 'Program',
  sourceType: 'module',
  body
})

export const Script = body => ({
  type: 'Program',
  sourceType: 'script',
  body
})

export const ExpressionStatement = expression => ({
  type: 'ExpressionStatement',
  expression
})

export const CallExpression = ({ callee, argumentsArray }) => ({
  type: 'CallExpression',
  callee,
  arguments: argumentsArray
})

export const MemberExpression = ({ object, property, computed }) => ({
  type: 'MemberExpression',
  object,
  property,
  computed
})

export const DebuggerStatement = () => ({
  type: 'DebuggerStatement'
})

export const VariableDeclaration = ({ kind, declarations }) => ({
  type: 'VariableDeclaration',
  kind,
  declarations
})

export const VariableDeclarator = ({ id, init }) => ({
  type: 'VariableDeclarator',
  id,
  init
})

const simpleVariableMaker = kind => ({ id, value }) => VariableDeclaration({
  kind,
  declarations: [
    VariableDeclarator({
      id,
      init: value
    })
  ]
})

export const ConstVariable = simpleVariableMaker('const')
export const VarVariable = simpleVariableMaker('var')
export const LetVariable = simpleVariableMaker('let')
