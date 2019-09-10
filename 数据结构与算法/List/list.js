//节点
function Node(element) {
  this.element = element //当前节点的元素
  this.next = null //下一个节点链接
}
//链表类
class LList {
  constructor() {
    this.head = new Node('head') //头节点
  }
  find(item) {
    var curNode = this.head
    while (curNode.element !== item) {
      curNode = curNode.next
    }
    return curNode
  }
  insert(newN, item) {
    var newNode = new Node(newN)
    var curNode = this.find(item)
    curNode.next = newNode
  }
  prefind(item) {
    var curNode = this.head
    while (curNode.next.element !== item) {
      curNode = curNode.next
    }
    return curNode
  }
  delete(item) {
    var curNode = this.prefind(item)
    if (curNode.next !== null) {
      curNode.next = curNode.next.next
    }
  }
  display() {
    var cur = this.head
    var ele = ''
    while (cur.next !== null) {
      ele += cur.element
      cur = cur.next
    }
    return ele + cur.element
  }
  reverse(data) {
    var cur = this.head
    var ele = data ? data : ''
    if (cur.next === null) {
      return ele + cur.element
    } else {
      while (cur.next !== null) {
        cur = cur.next
      }
      ele += cur.element
      this.prefind(cur.element).next = null
      return this.reverse(ele)
    }
  }
}
var fruits = new LList()

fruits.insert('Apple', 'head')
fruits.insert('Banana', 'Apple')
fruits.insert('Pear', 'Banana')
var h = fruits.display()
var h1 = fruits.reverse()
console.log(h)
console.log(h1)
