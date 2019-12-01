export const connectorValidator = ({ target, source }) => {
  console.log({ target, source })
  if (!target && !source) {
    debugger
  }
  if (target.kind === 'connector') {
    if (source.node && target.node) {
      if (target.node.numberOfInputs > 0) {
        return true
      } else {
        console.error(`Error, jack: "${target.name}"'s node does not have inputs.`)
        return false
      }
    } else {
      console.error(`Connection Error: No 'nodes' in connectorJack constructor`, { target: { node: target.node }, source: { node: source.node } })
      return false
    }
  } else {
    return false
  }
}