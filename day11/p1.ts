const input = await Deno.readTextFile('./example.txt').then((data) =>
  data.split('\r\n').map((item) => item.trim())
)
type MultiplierType = '+' | '*'
interface Monkey {
  id: number
  items: number[]
  worryMultiplier: number | 'old'
  multiplierType: MultiplierType
  testDivisible: number
  trueMonkey: number
  falseMonkey: number
}

function parseMonkeys(): Monkey[] {
  const monkeys: Monkey[] = []
  let currentMonkey: Partial<Monkey> = {}
  for (const str of input) {
    if (str === '') {
      monkeys.push(currentMonkey as Monkey)
      currentMonkey = {}
    }
    if (str.includes('Monkey')) {
      const monkeyId = parseInt(str.split(' ')[1].slice(0, -1))
      currentMonkey = {
        id: monkeyId,
      }
    }
    if (str.includes('Starting items:')) {
      const items = str
        .slice(str.indexOf(':') + 2)
        .split(', ')
        .map((item) => +item) as number[]
      currentMonkey.items = items
    }
    const items = str.split(' ')
    const last = +items[items.length - 1] as number
    if (str.includes('Operation:')) {
      const lastItem =
        items[items.length - 1] === 'old' ? 'old' : (+items[items.length - 1] as number | 'old')
      currentMonkey.worryMultiplier = lastItem
      currentMonkey.multiplierType = items[items.length - 2] as MultiplierType
    }
    if (str.includes('Test')) {
      currentMonkey.testDivisible = last
    }
    if (str.includes('If true')) {
      currentMonkey.trueMonkey = last
    }
    if (str.includes('If false')) {
      currentMonkey.falseMonkey = last
    }
  }
  monkeys.push(currentMonkey as Monkey)
  return monkeys
}

const monkeys = parseMonkeys()
console.log('monkeys', monkeys)
const counters: { [key: number]: number } = {}

// function checkMonkeyItem() {}

function increaseByMultiplier(
  item: number,
  worryMultiplier: number | 'old',
  type: MultiplierType
): number {
  const multiplier = worryMultiplier === 'old' ? item : worryMultiplier
  if (type === '*') return Math.floor((item * multiplier) / 3)
  else return Math.floor((item + multiplier) / 3)
}

function oneMonkeyRound(monkey: Monkey) {
  const monkeyItems = monkey.items
  while (monkeyItems.length) {
    const item = monkeyItems.shift() as number
    const newItem = increaseByMultiplier(item, monkey.worryMultiplier, monkey.multiplierType)
    const divisible = newItem % monkey.testDivisible === 0
    if (divisible) monkeys[monkey.trueMonkey].items.push(newItem)
    else monkeys[monkey.falseMonkey].items.push(newItem)
    if (counters[monkey.id]) counters[monkey.id]++
    else counters[monkey.id] = 1
  }
}

function makeRound() {
  for (const monkey of monkeys) {
    oneMonkeyRound(monkey)
  }
}

for (let index = 0; index < 20; index++) {
  makeRound()
}
const values = Object.values(counters)
const firstMax = Math.max(...values)
values.splice(values.indexOf(firstMax), 1)
const secondMax = Math.max(...values)
console.log('counters', counters)
console.log('result', firstMax * secondMax)
