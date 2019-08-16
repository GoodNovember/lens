// Global Environment

// Primitive
// const getInitials = environment => environment.first[0] + environment.last[0]
// const getName = initials => environment => `${initials} ${environment.first} ${environment.last}`
// const getIdentity = name => environment => `${environment.id.toString()} ${name}`
// const apply = x => f => f(x)
// const identity = environment => apply(getInitials(environment))(initials =>
//   apply(getName(initials)(environment))(name =>
//     getIdentity(name)(environment)
//   )
// )

const env = {
  id: 7,
  first: 'John',
  last: 'Doe'
}

// console.log(identity(env))

const getInitials = environment => `${environment.first[0]}${environment.last[0]}`
const getName = initials => environment => `${initials} ${environment.first} ${environment.last}`
const getIdentity = name => environment => `${environment.id.toString()} ${name}`

const apply = x => f => environment => f(x(environment))(environment)

const identity = apply(getInitials)(initials =>
  apply(getName(initials))(name =>
    getIdentity(name)
  )
)

console.log(identity(env))
