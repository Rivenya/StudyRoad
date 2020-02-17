function createElement(type, props, ...children) {
  delete props.__self
  delete props.__source
  props.children = children
  //vtype 1为普通节点
  //      2为funciton
  //      3为class
  if (typeof type === 'string') {
    return { vtype: 1, type: type, props: props }
  } else if (typeof type === 'function') {
    if (type.isClassComponet) {
      return { vtype: 3, type: type, props: props }
    } else {
      return { vtype: 2, type: type, props: props }
    }
  }
}
export class Component {
  //判断是否为class组件，因为function和class  typeof都是function
  static isClassComponet = true
  constructor(props) {
    this.props = props
    this.state = {}
  }
}
export default { createElement }
