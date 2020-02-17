//转换vdom为真实dom
export function initVNode(vnode) {
  let { vtype } = vnode
  if (!vtype) {
    return document.createTextNode(vnode)
  }
  if (vtype === 1) {
    return createElement(vnode)
  }
  if (vtype === 2) {
    return createFunction(vnode)
  }
  if (vtype === 3) {
    return createClass(vnode)
  }
}

function createElement(vnode) {
  const { type, props } = vnode
  const node = document.createElement(type)
  const { key, children, ...rest } = props
  Object.keys(rest).forEach(key => {
    if (key === 'className') {
      node.setAttribute('class', rest[key])
    } else if (key === 'htmlFor') {
      node.setAttribute('for', rest[key])
    } else if (key === 'style') {
      const style = Object.keys(rest[key])
        .map(
          s =>
            `${s.replace(/[A-Z]/g, item => `-${item.toLowerCase()}`)}:${
              rest[key][s]
            }`
        )
        .join(';')
      node.setAttribute('style', style)
    } else if (key.startsWith('on')) {
      node.addEventListener(key.toLowerCase().replace('on', ''), rest[key])
    }
  })
  children.forEach(c => {
    if (Array.isArray(c)) {
      c.forEach(item => {
        node.appendChild(initVNode(item))
      })
    } else {
      node.appendChild(initVNode(c))
    }
  })
  return node
}

function createFunction(vnode) {
  const { type, props } = vnode
  const node = type(props)
  return initVNode(node)
}

function createClass(vnode) {
  const { type, props } = vnode
  const node = new type(props)
  return initVNode(node.render())
}
