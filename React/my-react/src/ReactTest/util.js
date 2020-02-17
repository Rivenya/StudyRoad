import { HTML_KEY } from './constant'
import { addEvent, removeEvent } from './event-system'
import {
  setPropValue,
  removePropValue,
  updateSelectOptions
} from './DOMPropertyOperations'
let uid = 0

/**获取唯一id */
export function getUid() {
  return ++uid
}

/**管道函数*/
export function pipe(...arg) {
  return function(inital) {
    return arg.reduce((value, fn) => fn(value), inital)
  }
}

/**判断是否是数组 */
export let isArr = Array.isArray

/**拉平数组 */
export function flatEach(list, iteratee, a) {
  let len = list.length
  let i = -1

  while (len--) {
    let item = list[++i]
    if (isArr(item)) {
      flatEach(item, iteratee, a)
    } else {
      iteratee(item, a)
    }
  }
}

/**设置props */
export function setProps(elem, props, isCustomComponent) {
  var isSelect = elem.nodeName === 'SELECT'
  for (let key in props) {
    if (key !== 'children') {
      if (isSelect && (key === 'value' || key === 'defaultValue')) {
        updateSelectOptions(elem, props.multiple, props[key])
      } else {
        setProp(elem, key, props[key], isCustomComponent)
      }
    }
  }
}

/**判断是不是监听事件 */
export let EVENT_KEYS = /^on/i

function setProp(elem, key, value, isCustomComponent) {
  if (EVENT_KEYS.test(key)) {
    addEvent(elem, key, value)
  } else if (key === 'style') {
    setStyle(elem.style, value)
  } else if (key === HTML_KEY) {
    if (value && value.__html != null) {
      elem.innerHTML = value.__html
    }
  } else if (isCustomComponent) {
    if (value == null) {
      elem.removeAttribute(key)
    } else {
      elem.setAttribute(key, '' + value)
    }
  } else {
    setPropValue(elem, key, value)
  }
}
