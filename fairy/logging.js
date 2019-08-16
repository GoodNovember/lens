console.log('FAIRY')

// logging

// const getId = ([nothing, log]) => [7, `${log}\nGot an ID of 7.`]

// const getUser = ([id, log]) => [{
//   first: 'John',
//   last: 'Doe',
//   middle: 'Bob'
// }, `${log}\nGot User by the name of John Doe Bob using id: ${id}`]

// const getMiddleName = ([user, log]) => [user.middle, `${log}\nGot the middle name of a user.`]

// const apply = x => f => f(x)

// const [middleName, log] = apply(getId([0, 'Requesting an ID...']))(id =>
//   apply(getUser(id))(user =>
//     getMiddleName(user)
//   )
// )

// console.log(log)

const apply = ([value, existingLog]) => f => {
  const [returnValue, returnedLog] = f(value)
  return [returnValue, `${existingLog}\n${returnedLog}`]
}

const getId = () => [7, 'Got ID of 7.']

const getUser = id => [
  {
    first: 'John',
    middle: 'Bob',
    last: 'Doe'
  },
  `Got a user with the name John Bob Doe using the ID: ${id}.`
]

const getMiddleName = user => [user.middle, `Got the middle name of a user, which happens to be ${user.middle}.`]

const [middleName, log] = apply(getId())(id =>
  apply(getUser(id))(user =>
    getMiddleName(user)
  )
)

console.log(log)
