class WVue {
  constructor(option) {
    this.option = option
    this.data = this.option.data
    this.bindDefine(this.data)

    new compile(option.el, this)

    option.created && option.created.call(this)
  }
  bindDefine(data) {
    if (data === '' || typeof data !== 'object') {
      return false
    }
    Object.keys(data).forEach(key => {
      this.defineAttribute(data, key, data[key])
      this.proxyData(key)
    })
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.data[key]
      },
      set(val) {
        this.data[key] = val
      }
    })
  }

  defineAttribute(object, key, value) {
    this.bindDefine(value)
    const dep = new Dependency()
    Object.defineProperty(object, key, {
      get() {
        Dependency.target && dep.addDep(Dependency.target)
        return value
      },
      set(newValue) {
        if (newValue == value) return false
        value = newValue
        dep.notify()
      }
    })
  }
}

class Dependency {
  constructor() {
    this.listDep = []
  }
  addDep(obj) {
    this.listDep.push(obj)
  }
  notify() {
    this.listDep.forEach(item => {
      item.update()
    })
  }
}

class compile {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    this.vm = vm
    if (this.el) {
      //内部转换为片段
      this.fragment = this.node2Fragment(this.el)
      //执行编译
      this.compile(this.fragment)
      //将编译完成的追加进el
      this.el.appendChild(this.fragment)
    }
  }
  //拿出el里面的元素出来遍历成片段
  node2Fragment(el) {
    // 把el所有子元素搬到frag
    const frag = document.createDocumentFragment()
    let children
    while ((children = el.firstChild)) {
      frag.appendChild(children)
    }
    return frag
  }

  //把所有片段编译出来
  compile(fragment) {
    const childNodes = fragment.childNodes
    childNodes.forEach(node => {
      if (this.isElement(node)) {
        const attributes = node.attributes
        Array.from(attributes).forEach(attr => {
          const name = attr.name
          const val = attr.value
          if (this.isDirective(name)) {
            const dir = name.substring(2)
            this[dir] && this[dir](node, this.vm, val)
          } else if (this.isEvent(name)) {
            const dir = name.substring(1)
            this.eventHandle(node, this.vm, val, dir)
          }
        })
      } else if (this.isInterpolation(node)) {
        this.compileText(node)
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  //编译文本
  compileText(node) {
    this.update(node, this.vm, RegExp.$1, 'text')
  }

  //更新函数
  update(node, vm, exp, dir) {
    const undateFn = this[dir + 'Updater']
    const value = this.getData(exp)
    //初始化
    undateFn && (node, value)
    //依赖收集
    new Watch(vm, this, exp, function(newValue) {
      undateFn && undateFn(node, newValue)
    })
  }

  //text指令函数
  text(node, vm, key) {
    this.update(node, vm, key, 'text')
  }
  //mode双向绑定函数
  model(node, vm, key) {
    this.update(node, vm, key, 'value')
    node.addEventListener(
      'input',
      function() {
        this.setData(key, node.value)
      }.bind(this)
    )
  }

  //@事件绑定函数
  eventHandle(node, vm, key, dir) {
    let fn = vm.option.methods && vm.option.methods[key]
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm))
    }
  }

  //text更新函数
  textUpdater(node, val) {
    node.textContent = val
  }

  //value更新函数
  valueUpdater(node, val) {
    node.value = val
  }

  // 判断是不是指令
  isDirective(name) {
    return name.indexOf('w-') === 0
  }
  // 判断是不是事件
  isEvent(name) {
    return name.indexOf('@') === 0
  }
  //判断是不是元素
  isElement(node) {
    return node.nodeType === 1
  }
  //判断是不是文字
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  //获取data里面的值
  getData(key) {
    let val = key.trim().split('.')
    let num = key.trim().split('.').length - 1
    let text = this.vm.data[val[0]]
    let i = 0
    while (num > 0) {
      i++
      text = text[val[i]]
      num = num - i
    }
    return text
  }
  //设定data里面的值
  setData(key, value) {
    let val = key.trim().split('.')
    let num = key.trim().split('.').length - 1
    if (num === 0) {
      this.vm.data[val[0]] = value
    } else {
      let text = this.vm.data[val[0]]
      let i = 0
      while (num > 0) {
        i++
        text = text[val[i]]
        num = num - i
        if (num === 0) {
          text[val[i]] = value
        }
      }
    }
  }
}
class Watch {
  constructor(vm, compile, key, callback) {
    this.vm = vm
    this.compile = compile
    this.key = key
    this.callback = callback

    Dependency.target = this
    this.compile.getData(this.key)
    Dependency.target = null
  }
  update() {
    this.val = this.compile.getData(this.key)
    this.callback.call(this.vm, this.val)
  }
}
