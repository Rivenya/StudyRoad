//广义表表示的二叉树 A(B(D,E(,G)),C(F))#
function Tree(data) {
  this.name = data
  this.leftChild = null
  this.rightChild = null
  this.parentNode = null
}

function Stack() {
  this.data = []
  this.push = num => {
    this.data.push(num)
  }
  this.pop = () => {
    return this.data.pop()
  }
  this.top = () => {
    return this.data[this.data.length - 1]
  }
  this.clear = () => {
    this.data = []
  }
}

class createTree {
  constructor(data) {
    this.data = data
    this.root = null
  }
  init() {
    const stack = new Stack()
    const data = this.data
    let k = null
    for (const i of data) {
      if (i === '#') {
        return this.root
      } else if (i === '(') {
        stack.push(cur_node)
        k = 1
      } else if (i === ',') {
        k = 2
      } else if (i === ')') {
        stack.pop()
      } else {
        var cur_node = new Tree(i)
        if (this.root === null) {
          this.root = cur_node
        } else {
          if (k === 1) {
            let top = stack.top()
            top.leftChild = cur_node
            cur_node.parentNode = top
          } else if (k === 2) {
            let top = stack.top()
            top.rightChild = cur_node
            cur_node.parentNode = top
          }
        }
      }
    }
  }
}

var a = new createTree('A(B(D,E(,G)),C(F))#')
console.log(a.init())
