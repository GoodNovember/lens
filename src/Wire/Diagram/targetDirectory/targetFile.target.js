const log = (...stuff) => { console.log(...stuff) } // uses a block statement for the body.
const log2 = (...stuff) => console.log(...stuff) // uses a call statement for the body.

function walrus (input, contact) {
  return contact(input)
}

walrus(123, function (dog) {
  log(dog)
})
