const input = await Deno.readTextFile('./example.txt').then((data) => data.split('\r\n'))

const neededCycles: { [key: number]: true } = {
  20: true,
  60: true,
  100: true,
  140: true,
  180: true,
  220: true,
}
let result = 0
let x = 1
let cycles = 0

function checkCycles() {
  if(neededCycles[cycles]) {
    result += x * cycles;
  }
}

for (const command of input) {
  ++cycles
  checkCycles()
  if (command === 'noop') continue
  ++cycles
  checkCycles()
  const countString = command.split(' ')[1]
  const count = +countString
  x += count
}

console.log('result :» ', result)
