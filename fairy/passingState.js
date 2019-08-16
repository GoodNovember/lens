// Passing State

const getRandom = state => {
  const result = 7 * state + 7
  const output = result % 100
  console.log(`Random Number ${output}`)
  return [output, result]
}

const getSum = x => y => state => [x + y, state]

const apply = x => f => state => {
  const result = x(state)
  return f(result[0])(result[1])
}

const sum = apply(getRandom)(random1 =>
  apply(getRandom)(random2 =>
    getSum(random1)(random2)
  ))

console.log(sum(7))
