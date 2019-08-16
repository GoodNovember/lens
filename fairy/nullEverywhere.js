const getId = () => {
  const random = Math.floor(Math.random() * 1000)
  return random < 700 ? random : null
}

// const getUser = id => {
//   if (id === null) {
//     return null
//   } else {
//     return {
//       first: 'John',
//       last: 'Doe',
//       middle: Math.random() < 0.7 ? 'Bob' : null
//     }
//   }
// }

const getUser = id => ({
  first: 'John',
  last: 'Doe',
  middle: Math.random() < 0.7 ? 'Bob' : null
})

// const getMiddleName = user => {
//   if (user.middle === null) {
//     return null
//   } else {
//     return user.middle
//   }
// }

const getMiddleName = user => user.middle

// const apply = x => f => f(x) //old

const apply = inputValue => specifiedFunction => inputValue === null ? null : specifiedFunction(inputValue)

const middleName = apply(getId())(id =>
  apply(getUser(id))(user =>
    getMiddleName(user)
  )
)

console.log(middleName)
