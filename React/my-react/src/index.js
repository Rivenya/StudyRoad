import React, { Component } from './newReact/React'
import ReactDOM from './newReact/ReactDom'

import AA from './newReact/a'
import BB from './newReact/b'

AA()
BB()
function Comp1({ children }) {
  return (
    <div>
      456
      <div>{children}</div>
      <button
        onClick={() => {
          alert('你点了')
        }}
      >
        点击
      </button>
    </div>
  )
}
class Comp2 extends Component {
  render() {
    const list = [
      { id: 1, type: '学生', name: '张三' },
      { id: 2, type: '老师', name: '张三的老师' }
    ]
    return (
      <div>
        <h2
          style={{ color: 'red', fontSize: '30px', border: '1px solid black' }}
        >
          hi {this.props.name}
        </h2>
        <ul>
          {list.map(item => (
            <li key={item.id}>
              他的身份是{item.type}·······名字叫{item.name}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function Jsx() {
  return (
    <div>
      <div>123</div>
      <Comp1>
        <Comp2 name="下面即将进行列表渲染  这是Props传递过来的"></Comp2>
      </Comp1>
    </div>
  )
}
const App = Jsx()
console.log(App)
//react流程
//第一步:webpack+babel 会编译Jsx然后执行createElement把jsx形式的代码转成原生js对象
//第二步:把jsx对象转化成virtual dom
//第三步:render把virtual dom转化成真实dom并append在根节点上
ReactDOM.render(App, document.getElementById('root'))
