/**
 *
 * @method html编码
 * @param {*} html
 * @returns
 */
export function htmlEncode(html: any) {
  const temp = document.createElement('div')
  temp.textContent !== undefined
    ? (temp.textContent = html)
    : (temp.innerText = html)
  const output = temp.innerHTML
  return output
}

/**
 *
 * @method html解码
 * @param {*} html
 * @returns
 */
export function htmlDecode(html: any) {
  const temp = document.createElement('div')
  temp.innerHTML = html
  const outPut = temp.innerText || temp.textContent
  return outPut
}

/**
 * @method 变量名转化扩展
 * @param {Array} data 数据源
 * @param  {Object} props {name:'title'} 比如把name转化成title
 */
export const antdTreeDataTransferExtend = (data: any, props: any) => {
  const tmpData = JSON.parse(JSON.stringify(data))
  const transferData = (obj: any) => {
    obj.forEach((item: any) => {
      for (const key in props) {
        if (item[key] !== undefined) {
          item[props[key]] = item[key]
          delete item[key]
        }
      }
      //children的判断条件改为 item.children.length
      if (item.children && item.children.length > 0) {
        transferData(item.children)
      }
    })
  }
  transferData(tmpData)
  return tmpData
}
