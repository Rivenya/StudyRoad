function UnionFindSet() {
  let parent = []
  this.init = function (size) {
    parent = new Array(size)
    for (let i = 0; i < parent.length; i++) {
      parent[i] = -1
    }
  }
  this.find = function (index) {
    while (parent[index] >= 0) {
      index = parent[index]
    }
    return index
  }
  this.union = function (x, y) {
    parent[x] += parent[y]
    parent[y] = x
  }
  this.build_relation = function (x, y) {
    let root1 = this.find(x)
    let root2 = this.find(y)
    if (root1 != root2) {
      this.union(root1, root2)
    }
  }
  this.isFriend = function (x, y) {
    let root1 = this.find(x)
    let root2 = this.find(y)
    return root1 === root2
  }
  this.get_friend_group_count = function () {
    let count = 0
    for (let i = 0; i < parent.length; i++) {
      if (parent[i] < 0) {
        count += 1
      }
    }
    return count
  }
}

const friend = [
  [3, 4],
  [1, 3],
  [2, 4],
  [1, 5],
  [2, 7],
  [0, 4],
  [4, 5],
  [3, 6],
  [8, 9]
]
const tree = new UnionFindSet()
tree.init(10)
for (let i = 0; i < friend.length; i++) {
  let item = friend[i]
  tree.build_relation(item[0], item[1])
}
console.log(`总共有${tree.get_friend_group_count()}个朋友圈`)
console.log(`3和4是不是朋友？  ${tree.isFriend(3, 4)}`)
console.log(`7和8是不是朋友？  ${tree.isFriend(7, 8)}`)


