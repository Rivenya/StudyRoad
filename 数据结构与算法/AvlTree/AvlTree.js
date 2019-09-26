function Tree(param) {
  this.node = param;
  this.parent = null;
  this.childLeft = null;
  this.childRight = null;
}
function AvlTree() {
  this.root = null
  getHeight = (tree) => {
    if (tree === null) {
      return 0
    } else {
      return Math.max(getHeight(tree.childLeft), getHeight(tree.childRight)) + 1
    }
  }
  link_parent = (old, news) => {
    let parent = old.parent
    if (parent === null) {
      news.parent = null
      old.parent = news
    } else {
      if (parent.childLeft && parent.childLeft.node === old.node) {
        parent.childLeft = news
      } else {
        parent.childRight = news
      }
      news.parent = parent
      old.parent = news
    }
  }
  link_parent_remove = (parents, root, child) => {
    if (parents.childLeft.node === root.node) {
      parents.childLeft = child
      if (child) {
        child.parent = parents
      }
    } else {
      parents.childRight = child
      if (child) {
        child.parent = parents
      }
    }
  }
  rotateLL = (tree, newTree) => {
    link_parent(tree, newTree)
    let tmp = newTree.childLeft
    newTree.childLeft = tree
    tree.childRight = tmp
    return newTree
  }
  rotateRR = (tree, newTree) => {
    link_parent(tree, newTree)
    let tmp = newTree.childRight
    newTree.childRight = tree
    tree.childLeft = tmp
    return newTree
  }
  rotateLR = (tree) => {
    rotateLL(tree.childLeft, tree.childLeft.childRight)
    return rotateRR(tree, tree.childLeft)
  }
  rotateRL = (tree) => {
    rotateRR(tree.childRight, tree.childRight.childLeft)
    return rotateLL(tree, tree.childRight)
  }
  Check = () => {
    let leftHeight = getHeight(this.root.childLeft)
    let rightHeight = getHeight(this.root.childRight)
    if (rightHeight - leftHeight > 1) {
      let leftchildHeight = this.root.childRight ? getHeight(this.root.childRight.childLeft) : 0
      let rightchildHeight = this.root.childRight ? getHeight(this.root.childRight.childRight) : 0
      if (rightchildHeight > leftchildHeight) {
        this.root = rotateLL(this.root, this.root.childRight)
      } else {
        this.root = rotateRL(this.root)
      }
    } else if (rightHeight - leftHeight < -1) {
      let leftchildHeight = this.root.childLeft ? getHeight(this.root.childLeft.childLeft) : 0
      let rightchildHeight = this.root.childLeft ? getHeight(this.root.childLeft.childRight) : 0
      if (rightchildHeight > leftchildHeight) {
        this.root = rotateLR(this.root)
      } else {
        this.root = rotateRR(this.root, this.root.childLeft)
      }
    }
  }
  insertValue = (root, param) => {
    if (!root) {
      this.root = new Tree(param)
    } else {
      if (root.node > param) {
        if (root.childLeft === null) {
          let tmp = new Tree(param)
          root.childLeft = tmp
          tmp.parent = root
          Check()
          return true
        } else {
          return insertValue(root.childLeft, param)
        }
      } else if (root.node < param) {
        if (root.childRight === null) {
          let tmp = new Tree(param)
          root.childRight = tmp
          tmp.parent = root
          Check()
          return true
        } else {
          return insertValue(root.childRight, param)
        }
      } else {
        return false
      }
    }
  }
  deleteValue = (root, params) => {
    if (root === null) {
      return false
    } else if (params > root.node) {
      return deleteValue(root.childRight, params)
    } else if (params < root.node) {
      return deleteValue(root.childLeft, params)
    } else if (params === root.node) {
      if (root.childLeft && root.childRight) {
        let tmp = root.childRight
        while (tmp.childLeft) {
          tmp = tmp.childLeft
        }
        let tree = new Tree(tmp.node)
        tree.childLeft = root.childLeft
        if (!root.parent) {
          tree.childRight = root.childRight.childRight
          tree.parent = null
          this.root = tree
          this.root.childLeft.parent = tree
          return true
        } else {
          tree.childRight = root.childRight
          root.childLeft.parent = tree
          root.childRight.parent = tree
          link_parent_remove(root.parent, root, tree)
          return deleteValue(root.childRight, tmp.node)
        }
      } else {
        let parents = root.parent
        if (root.childRight) {
          link_parent_remove(parents, root, root.childRight)
        } else if (root.childLeft) {
          link_parent_remove(parents, root, root.childLeft)
        } else {
          link_parent_remove(parents, root, null)
        }
        return true
      }
    }
  }
  deleteValueDetail = (root, params) => {
    if (root.parent.childLeft === params) {
      root.parent.childLeft = root.childLeft
    } else {
      root.parent.childRight = root.childLeft
    }
  }
  this.insert = function (param) {
    insertValue(this.root, param)
  }
  this.remove = function (param) {
    deleteValue(this.root, param)
  }
}
var z = new AvlTree()
z.insert(12)
z.insert(15)
z.insert(20)
z.insert(18)
z.insert(16)
z.insert(19)