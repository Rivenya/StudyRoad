class WVue {
  constructor(option) {
    this.option = option
    this.data = this.option.data
    this.interceptData(this.data)
    //第四步，把node节点跟watcher绑定
    new Compile(this.option.el, this.option)

    //编译变成执行生命周期钩子
    this.option.created && this.option.created()
  }
  //第一步截取数据
  interceptData(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.definePro(data, key, data[key])
      this.proxyKey(key)
    })
  }
  definePro(data, key, value) {
    this.interceptData(value)
    //第二步绑定依赖
    const dep = new Depend()
    Object.defineProperty(data, key, {
      get() {
        Depend.target && dep.addDep(Depend.target)
        return value
      },
      set(newValue) {
        value = newValue
        //第三布通知所有的watch更新,数据模型和watch绑定
        dep.subscribes()
      }
    })
  }
  proxyKey(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.data[key]
      },
      set(newValue) {
        this.data[key] = newValue
      }
    })
  }
}

class Depend {
  constructor() {
    this.dep = []
  }
  addDep(val) {
    this.dep.push(val)
  }
  subscribes() {
    this.dep.forEach(item => {
      item.updater()
    })
  }
}

class Watch {
  constructor(compile, key, callback) {
    this.compile = compile
    this.key = key
    this.callback = callback

    Depend.target = this
    this.compile.getData(key)
  }
  updater() {
    const newVal = this.compile.getData(this.key)
    this.callback(newVal)
  }
}

class Compile {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    this.vm = vm
    if (this.el) {
      //第一步，把整个节点转换为片段
      this.frag = this.fragment(this.el)
      //第二步开始编译
      this.compile(this.frag)
      //第三步，把编译完成的加入进去
      this.el.appendChild(this.frag)
    }
  }
  fragment(node) {
    const frag = document.createDocumentFragment()
    let firstchild = ''
    while ((firstchild = node.firstChild)) {
      frag.appendChild(firstchild)
    }
    return frag
  }
  compile(frag) {
    const children = frag.childNodes
    children.forEach(node => {
      if (this.isText(node)) {
        this.compileText(node)
      } else if (this.isAttribute(node)) {
        let nodes = node.attributes
        Array.from(nodes).forEach(item => {
          const name = item.name
          const val = item.value
          if (name.indexOf('w-') > -1) {
            this[name.slice(2)] && this[name.slice(2)](node, val)
          } else if (name.indexOf('@') > -1) {
            this.bindEvent(node, name.slice(1), val)
          }
        })
      }
      if (node.childNodes) {
        this.compile(node)
      }
    })
  }

  compileText(node) {
    this.updater(node, RegExp.$1.trim(), 'text')
  }
  updater(node, key, dir) {
    const value = this.getData(key)
    if (value) {
      if (dir === 'text') {
        node.textContent = value
      } else if (dir === 'value') {
        node.value = value
      }
    }
    new Watch(this, key, function(newVal) {
      if (dir === 'text') {
        node.textContent = newVal
      } else if (dir === 'value') {
        node.value = newVal
      }
    })
  }
  text(node, val) {
    this.updater(node, val)
  }
  model(node, val) {
    this.updater(node, val, 'value')
    node.addEventListener(
      'input',
      function() {
        this.setData(val, node.value)
      }.bind(this)
    )
  }
  bindEvent(node, name, key) {
    const method = this.vm.methods[key].bind(this.vm)
    node.addEventListener(name, method)
  }
  isText(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  isAttribute(node) {
    return node.nodeType === 1
  }
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
