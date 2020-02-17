import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'

import Icon, { IconMap } from '@~/scf-ui/icon/icon'
import Style from './tree-select.style'

export interface DataParams {
  id: string
  name: string
  parentId?: string
  children?: DataParams[]
}
export interface TreeSelectProps {
  data: DataParams
  title: string
  mode?: 'asyncData'
  itemRender?: (id: string) => Promise<DataParams[]>
  callback: (item: DataParams) => void
  close: () => void
}

const TreeSelect: React.FC<TreeSelectProps> = (props: TreeSelectProps) => {
  /**头部导航堆 */
  const [headerHeap, useHeaderHeap] = useState([props.data])
  /**展示列表 */
  const [showHeap, useshowrHeap] = useState(props.data.children)
  /**当前被选key */
  const [selectKey, useSelectKey] = useState(props.data.id)

  /**
   * @method 寻找对象
   * @param {DataParams} target 目标对象
   * @param {string} id 匹配目标
   * @returns {(DataParams | boolean)} 返回目标对象或者false
   */
  const findObj = (target: DataParams, id: string): DataParams | boolean => {
    let index = 0
    while (target.children && target.children.length > index) {
      if (target.children[index].id === id) {
        return target.children[index]
      } else if (target.children[index].children) {
        const result = findObj(target.children[index], id)
        if (result) {
          return result
        }
      }
      index++
    }
    return false
  }

  /**
   *
   * @method 对象是否存在,并返回位置
   * @param {DataParams[]} target 目标对象
   * @param {string} id 匹配目标
   * @param {('id' | 'parentId')} name 目标的对象的匹配对象
   * @returns {number}  -1表示不存在
   */
  const isExist = (
    target: DataParams[],
    id: string,
    name: 'id' | 'parentId'
  ): number => {
    let tmp = -1
    target.forEach((item: DataParams, index) => {
      if (item[name] === id) {
        tmp = index
      }
    })
    return tmp
  }

  /**头部点击事件 */
  const _onHeaderPress = (item: DataParams) => {
    useSelectKey(item.id)
    useshowrHeap(item.children)
  }

  /**展开列表事件 */
  const _onShowPress = (item: DataParams) => {
    if (props.mode && props.mode === 'asyncData') {
      props.itemRender &&
        props.itemRender(item.id).then((res: string | DataParams[]) => {
          if (typeof res === 'string') {
            props.callback(item)
          } else if (typeof res === 'object') {
            try {
              const obj = findObj(props.data, item.id) as DataParams
              obj.children = res
              const tmp = [...headerHeap, obj]
              useSelectKey(item.id)
              useHeaderHeap(tmp)
              useshowrHeap(obj.children)
            } catch (error) {
              console.log(error)
            }
          }
        })
    } else {
      useSelectKey(item.id)
      const obj = findObj(props.data, item.id) as DataParams
      try {
        if (obj.children) {
          const parentId = obj.parentId as string
          const parentIndex = isExist(headerHeap, parentId, 'parentId')
          if (parentIndex >= 0) {
            const tmp = JSON.parse(JSON.stringify(headerHeap))
            tmp.length = parentIndex
            tmp.push(obj)
            useHeaderHeap(tmp)
          } else {
            const tmp = [...headerHeap, obj]
            useHeaderHeap(tmp)
          }
          useshowrHeap(obj.children)
        } else {
          props.callback(item)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <View style={Style.container}>
      <View style={Style.titleContainer}>
        <Text style={Style.titleText}>{props.title}</Text>
        <Text onPress={props.close}>
          <Icon style={Style.titleIcon} icon={IconMap.close} size={20}></Icon>
        </Text>
      </View>

      {/* 头部 */}
      <View style={Style.headerContainer}>
        {headerHeap.length > 0 ? (
          headerHeap.map((item: DataParams) => (
            <Text
              key={item.id}
              style={
                item.id === selectKey
                  ? Style.headerTextSelect
                  : Style.headerText
              }
              onPress={() => {
                _onHeaderPress(item)
              }}
            >
              {item.name}
            </Text>
          ))
        ) : (
          <Text key="请选择" style={Style.headerTextSelect}>
            请选择
          </Text>
        )}
      </View>

      {/* 展开列表 */}
      <ScrollView style={Style.content}>
        {showHeap &&
          showHeap.map((item: DataParams) => (
            <View key={item.id} style={Style.contentText}>
              {isExist(headerHeap, item.id, 'id') >= 0 && (
                <View style={{ marginRight: 4 }}>
                  <Icon icon={IconMap.select} color="red" size={20} />
                </View>
              )}
              <Text
                onPress={() => {
                  _onShowPress(item)
                }}
              >
                {item.name}
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  )
}
export default TreeSelect
