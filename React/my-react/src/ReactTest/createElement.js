import { VELEMENT, VSTATELESS, VCOMPONENT } from './constant'
import { createVnode } from './virtualDom'

/**
 * @export 返回虚拟dom
 * @param  type 节点类型
 * @param  props  节点属性
 * @param  children 子节点
 */
export default function createElement(type, props, ...children) {
  /** 虚拟节点的类型 */
  let nodeType = null
  if (typeof type === 'string') {
    nodeType = VELEMENT
  } else if (typeof type === 'function') {
    if (type && type.isReactComponent) {
      nodeType = VCOMPONENT
    } else {
      nodeType = VSTATELESS
    }
  } else {
    throw new Error(`React.createElement: unexpect type [ ${type} ]`)
  }
  let key = null
  let ref = null
  let finalProps = {}
  if (props != null) {
    for (const propskey in props) {
      if (props.haswnProperty(propskey)) {
        if (propskey === 'key' && props.key !== undefined) {
          key = '' + props.key
        } else if (propskey === 'ref' && props.ref !== undefined) {
          ref = '' + props.ref
        } else {
          finalProps[propskey] = props[propskey]
        }
      }
    }
  }
  finalProps.children = children

  return createVnode(nodeType, type, finalProps, key, ref)
}
