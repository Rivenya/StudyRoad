/**
 * render函数
 */
import * as _ from './util'
import {
  COMPONENT_ID,
  VELEMENT,
  VCOMPONENT,
  ELEMENT_NODE_TYPE
} from './constant'
import { initVnode, clearPending, compareTwoVnodes } from './virtual-dom'
import { updateQueue } from './Component'

export function render(vnode, container, callback) {
  return renderTreeIntoContainer(vnode, container, callback)
}

function isValidContainer(node) {
  //挂载的根节点不是string就是error的
  return !!(node && node.nodeType === ELEMENT_NODE_TYPE)
}

let pendingRendering = {}
let vNodeStore = {}

function renderTreeIntoContainer(vnode, container, callback, parentContext) {
  if (!vnode.vtype) {
    throw new Error(`cannot render ${vnode} to container`)
  }
  if (!isValidContainer(container)) {
    throw new Error(`container ${container} is not a DOM element`)
  }
  // 读取节点的uid
  let id = container[COMPONENT_ID] || (container[COMPONENT_ID] = _.getUid())
  //拿出节点的缓存
  let argsCache = pendingRendering[id]
  /**
   * 1.检查节点是否有缓存
   * 2.检查节点是否是预渲染
   *  2.1 节点预渲染为true,预渲染队列里面的对应的值改变
   *  2.2 节点已渲染过，直接赋值
   */
  if (argsCache) {
    if (argsCache === true) {
      pendingRendering[id] = argsCache = { vnode, callback, parentContext }
    } else {
      argsCache.vnode = vnode
      argsCache.parentContext = parentContext
      argsCache.callback = argsCache.callback
        ? _.pipe(argsCache.callback, callback)
        : callback
    }
    return
  }
  //节点第一次渲染，将节点标记为预渲染
  pendingRendering[id] = true
  //老节点
  let oldVnode = null
  //真实节点
  let rootNode = null
  //对比
  if ((oldVnode = vNodeStore[id])) {
    rootNode = compareTwoVnodes(
      oldVnode,
      vnode,
      container.firstChild,
      parentContext
    )
  } else {
    //渲染出真实节点
    rootNode = initVnode(vnode, parentContext)
    let childNode = null
    while ((childNode = container.lastChild)) {
      //删除容器里面的所有节点
      container.removeChild(childNode)
    }
    container.appendChild(rootNode)
  }
  //保存节点，以后好做diff
  vnodeStore[id] = vnode
  let isPending = updateQueue.isPending
  updateQueue.isPending = true
  clearPending()
  argsCache = pendingRendering[id]
  delete pendingRendering[id]

  let result = null
  if (typeof argsCache === 'object') {
    result = renderTreeIntoContainer(
      argsCache.vnode,
      container,
      argsCache.callback,
      argsCache.parentContext
    )
  } else if (vnode.vtype === VELEMENT) {
    result = rootNode
  } else if (vnode.vtype === VCOMPONENT) {
    result = rootNode.cache[vnode.uid]
  }

  if (!isPending) {
    updateQueue.isPending = false
    updateQueue.batchUpdate()
  }

  if (callback) {
    callback.call(result)
  }

  return result
}
