function Tree(param) {
  this.node = param;
  this.parentNode = null;
  this.leftChildNode = null;
  this.rightChildNode = null;
}
function BinarySortTree() {
  this.root = null;
  insertValue = (root, param) => {
    if (root === null) {
      this.root = new Tree(param)
      return true
    } else if (param > root.node) {
      if (root.rightChildNode === null) {
        let value = new Tree(param)
        root.rightChildNode = value
        value.parentNode = root
        return true
      } else {
        return insertValue(root.rightChildNode, param)
      }
    } else if (param < root.node) {
      if (root.leftChildNode === null) {
        let value = new Tree(param)
        root.leftChildNode = value
        value.parentNode = root
        return true
      } else {
        return insertValue(root.leftChildNode, param)
      }
    } else if (param === root.node) {
      return false
    }
  }
  link_parent = (parents, root, child) => {
    if (parents.leftChildNode.node === root.node) {
      parents.leftChildNode = child
      if (child) {
        child.parentNode = parents
      }
    } else {
      parents.rightChildNode = child
      if (child) {
        child.parentNode = parents
      }
    }
  }
  deleteValue = (root, params) => {
    if (root === null) {
      return false
    } else if (params > root.node) {
      return deleteValue(root.rightChildNode, params)
    } else if (params < root.node) {
      return deleteValue(root.leftChildNode, params)
    } else if (params === root.node) {
      if (root.leftChildNode && root.rightChildNode) {
        let tmp = root.rightChildNode
        while (tmp.leftChildNode) {
          tmp = tmp.leftChildNode
        }
        let tree = new Tree(tmp.node)
        tree.leftChildNode = root.leftChildNode
        if (!root.parent) {
          tree.rightChildNode = root.rightChildNode.rightChildNode
          tree.parentNode = null
          this.root = tree
          this.root.leftChildNode.parentNode = tree
          return true
        } else {
          tree.rightChildNode = root.rightChildNode
          root.leftChildNode.parentNode = tree
          root.rightChildNode.parentNode = tree
          link_parent(root.parentNode, root, tree)
          return deleteValue(root.rightChildNode, tmp.node)
        }
      } else {
        let parents = root.parentNode
        if (parents === null) {
          this.root.leftChildNode.parentNode = null
          this.root = this.root.leftChildNode
        } else {
          if (root.rightChildNode) {
            link_parent(parents, root, root.rightChildNode)
          } else if (root.leftChildNode) {
            link_parent(parents, root, root.leftChildNode)
          } else {
            link_parent(parents, root, null)
          }
          return true
        }
      }
    }
  }
  // 插入方法
  this.insert = function (param) {
    return insertValue(this.root, param)
  }
  // 删除方法
  this.delete = function (params) {
    return deleteValue(this.root, params)
  }
  // 搜索数
  this.search = function (param) {
    if (!this.root) {
      return false
    } else {
      let tmp = this.root
      while (tmp) {
        if (tmp.node > param) {
          tmp = tmp.leftChildNode
        } else if (tmp.node < param) {
          tmp = tmp.rightChildNode
        } else {
          return true
        }
      }
      return false
    }
  }
  // 获取最大值
  this.getMax = function () {
    let tmp = this.root
    while (tmp.rightChildNode) {
      tmp = tmp.rightChildNode
    }
    return tmp.node
  }
  // 获取最小值
  this.getMin = function () {
    let tmp = this.root
    while (tmp.leftChildNode) {
      tmp = tmp.leftChildNode
    }
    return tmp.node
  }
}

var z = new BinarySortTree()
z.insert(20)
z.insert(15)
z.insert(12)
z.insert(18)
z.insert(16)
z.insert(19)