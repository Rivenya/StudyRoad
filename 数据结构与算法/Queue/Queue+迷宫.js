const map = [
  [0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0]
]
class Queue {
  constructor() {
    this.x = []
  }
  enque(item) {
    return this.x.push(item)
  }
  deque() {
    return this.x.shift()
  }
  getque() {
    return this.x
  }
}
let start = [0, 0, 0]
let stop = [3, 4]
function direct(array, x, y, lujing) {
  let direct = []
  let z = lujing + 1
  // 判断边界值
  if (x === 0) {
    if (y === 0) {
      direct.push([x, y + 1, z])
      direct.push([x + 1, y, z])
      return direct
    }
    if (y === array[0].length - 1) {
      direct.push([x, y - 1, z])
      direct.push([x + 1, y, z])
      return direct
    } else {
      direct.push([x, y + 1, z])
      direct.push([x + 1, y, z])
      direct.push([x, y - 1, z])
      return direct
    }
  } else if (x === array.length - 1) {
    if (y === 0) {
      direct.push([x - 1, y, z])
      direct.push([x, y + 1, z])
      return direct
    } else if (y === array[0].length - 1) {
      direct.push([x - 1, y, z])
      direct.push([x, y - 1, z])
      return direct
    } else {
      direct.push([x, y + 1, z])
      direct.push([x - 1, y, z])
      direct.push([x, y - 1, z])
      return direct
    }
  } else if (y === 0) {
    if (x !== 0 && x !== array.length - 1) {
      direct.push([x - 1, y, z])
      direct.push([x, y + 1, z])
      direct.push([x + 1, y, z])
      return direct
    }
  } else if (y === array[0].length - 1) {
    if (x !== 0 && x !== array.length - 1) {
      direct.push([x - 1, y, z])
      direct.push([x, y - 1, z])
      direct.push([x + 1, y, z])
      return direct
    }
  } else {
    direct.push([x - 1, y, z])
    direct.push([x, y + 1, z])
    direct.push([x + 1, y, z])
    direct.push([x, y - 1, z])
    return direct
  }
}
function init(map, start, stop) {
  let que = new Queue()
  let map2 = JSON.parse(JSON.stringify(map))
  que.enque(start)
  while (que.x.length > 0) {
    let num = que.deque()
    if (num[0] === stop[0] && num[1] === stop[1]) {
      map2[num[0]][num[1]] = '*'
      console.log(map)
      console.log(map2)
      break
    } else if (map2[num[0]][num[1]] === 0) {
      map2[num[0]][num[1]] = 10 + num[2]
      let array = direct(map, num[0], num[1], num[2])
      for (let item of array) {
        if (map2[item[0]][item[1]] === 0) {
          que.enque(item)
        }
      }
    }
  }
}
init(map, start, stop)
