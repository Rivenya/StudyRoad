/**
 * 虚拟dom创建
 */
import * as _ from './util'
import { VELEMENT, VSTATELESS, VCOMPONENT, HTML_KEY } from './constant'

let refs = null
let pendingRefs = []

export function createVnode(nodeType, type, props, key, ref) {
  /**创建vnode */
  let vNode = {
    vtype: nodeType,
    type: type,
    props: props,
    key: key,
    ref: ref
  }
  if (vNode.vtype === VSTATELESS || vNode.vtype === VELEMENT) {
    vNode.uid = _.getUid()
  }
  return vNode
}
/**
 * 虚拟dom初始化
 */
export function initVnode(vnode, parentContext) {
  let { vtype } = vnode
  let node = null
  if (!vtype) {
    node = document.createTextNode(vnode)
  } else if (vtype === VELEMENT) {
    // init element
    node = initVelem(vnode, parentContext)
  } else if (vtype === VCOMPONENT) {
    // init stateful component
    node = initVcomponent(vnode, parentContext)
  } else if (vtype === VSTATELESS) {
    // init stateless component
    node = initVstateless(vnode, parentContext)
  }
  return node
}

/**
 * init element
 */
function initVelem(vnode, parentContext) {
  let { type, props } = vnode
  let node = document.createElement(type)
  initVElementChildren(vnode, node, parentContext)

  let isCustomCompoent = type.indexOf('-') >= 0 || props.is != null
  _.setProps(node, props, isCustomComponent)

  if (vnode.ref != null) {
    pendingRefs.push(vnode)
    pendingRefs.push(node)
  }

  return node
}
// 遍历children 循环调用initVnode
function initVElementChildren(vnode, node, parentContext) {
  let vchildren = (node.vchildren = getFlattenChildren(vnode))
  for (let i = 0, len = vchildren.length; i < len; i++) {
    node.appendChild(initVnode(vchildren[i], parentContext))
  }
}
function getFlattenChildren(vnode) {
  let { children } = vnode.props
  let vchildren = []
  if (_.isArr(children)) {
    _.flatEach(children, collectChild, vchildren)
  } else {
    collectChild(children, vchildren)
  }
  return vchildren
}
function collectChild(children, vchildren) {
  if (children != null && typeof children !== 'boolean') {
    vchildren[vchildren.length] = children
  }
}
/**
 *  1.首先查看虚拟dom里面的新节点和原节点对比之后，是否存在，不存在则删除
 *  2.然后查看虚拟dom里面的新节点和原节点的type类型是否一样，或者key值是否一样，如果不一样就替换
 *  3.查看虚拟dom里的新节点和原地节点是否一致，不一致则update
 */
export function compareTwoVnodes(vnode, newVnode, node, parentContext) {
  let newNode = node
  if (newVnode == null) {
    // remove
    destroyVnode(vnode, node)
    node.parentNode.removeChild(node)
  } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
    // replace
    destroyVnode(vnode, node)
    newNode = initVnode(newVnode, parentContext)
    node.parentNode.replaceChild(newNode, node)
  } else if (vnode !== newVnode || parentContext) {
    // same type and same key -> update
    newNode = updateVnode(vnode, newVnode, node, parentContext)
  }
  return newNode
}
