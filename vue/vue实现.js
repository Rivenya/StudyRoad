class WVue {
  constructor(option) {
    this.option = option
    this.data = this.option.data
    this.bindDefine(this.data)

    new Watch()
    this.data.title
    option.data.pepole[0].name
  }
  bindDefine (data) {
    if (data === "" || typeof data !== 'object') {
      return false
    }
    Object.keys(data).forEach(key => {
      this.defineAttribute(data, key, data[key])
    })
  }
  defineAttribute (object, key, value) {
    this.bindDefine(value)
    const dep = new Dependency()
    Object.defineProperty(object, key, {
      get () {
        Dependency.target && dep.addDep(Dependency.target)
        return value
      },
      set (newValue) {
        if (newValue == value) return false
        value = newValue
        dep.notify()
        // console.log(`${key}发生了改变----${value}改变成了-----${newValue}`)
      }
    })
  }
}

class Dependency {
  constructor() {
    this.listDep = []
  }
  addDep (obj) {
    this.listDep.push(obj)
  }
  notify () {
    this.listDep.forEach(item => {
      item.update()
    })
  }
}

class Watch {
  constructor() {
    Dependency.target = this
  }
  update () {
    console.log("改变了")
  }
}