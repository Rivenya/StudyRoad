function Min_heap(data) {
  this.heap = data
  this.shiftUp = function () {
    let length = this.heap.length
    let cur_node = null
    let parent_node = null
    for (let i = 0; i < length; i++) {
      cur_node = length - 1 - i;
      parent_node = Math.floor((cur_node - 1) / 2)
      while (parent_node >= 0) {
        let child_left = parent_node * 2 + 1 > length ? null : parent_node * 2 + 1
        let child_right = parent_node * 2 + 2 > length ? null : parent_node * 2 + 2
        if (child_left || child_right) {
          let min = this.heap[child_left] >= this.heap[child_right] ? child_right : child_left
          if (this.heap[min] < this.heap[parent_node]) {
            let tmp = this.heap[parent_node]
            this.heap[parent_node] = this.heap[min]
            this.heap[min] = tmp
          }
        }
        cur_node = parent_node;
        parent_node = Math.floor((cur_node - 1) / 2)
      }
    }
    return this.heap
  }
  this.insert = function (num) {
    this.heap.push(num)
    this.shiftUp()
  }
  this.removeMin = function () {
    var a = this.heap.shift()
    this.shiftUp()
    return a
  }
  this.get = function () {
    return this.heap
  }
}

var ar = [1, 31, 15, 7, 9, 20, 3, 40, 23, 4, 5, 7]
var min = new Min_heap(ar)
min.shiftUp()
console.log(min.get());
