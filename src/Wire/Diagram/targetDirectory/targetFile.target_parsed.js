const log = (...stuff) => {
  console.log(...stuff)
}
const log2 = (...stuff) => console.log(...stuff)
function walrus (input, contact) {
  return contact(input)
}
walrus(123, function (dog) {
  log(dog)
})
