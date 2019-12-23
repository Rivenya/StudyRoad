import React from 'react'
import { Input, Button } from 'antd'

//高阶组件运用，form表单的封装
function HocForm (Comp) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      //缓存数据
      this.option = {}
      //缓存状态
      this.state = {}
    }

    onChange = (e) => {
      const { name, value } = e.target

      this.setState({ [name]: value }, () => {
        //进行校验
        this.validateField(name)
      })
    }

    //input的包装器
    // 使用的规则 name,option
    getFiled = (name, option) => {
      this.option[name] = option
      return PropsComp => <div> {React.cloneElement(PropsComp, {
        name: name,
        value: this.state[name],
        onChange: this.onChange
      })}
        {/* 校验错误信息 */}
        {this.state[`${name}errMsg`] && (
          <p style={{ color: 'red' }}>{this.state[`${name}errMsg`]}</p>
        )}</div>
    }

    //单项校验
    validateField = (name) => {
      // 使用的方式
      // {require:true,msg:"must tianxie"}
      const rules = this.option[name].rules
      const result = rules.some(item => {
        //require规则，还可以继续添加规则
        if (item.require) {
          if (!this.state[name]) {
            this.setState({ [`${name}errMsg`]: item.msg })
            return true
          }
        }
        return false
      })
      //result为true时表示校验失败
      if (!result) {
        // 校验成功
        this.setState({ [`${name}errMsg`]: '' })
      }
      //返回的状态，false为校验成功，true为校验失败
      return result
    }

    //校验所有字段
    validate = (cb) => {
      //返回的状态，false为校验成功，true为校验失败
      const result = Object.keys(this.option).map(name => {
        this.validateField(name)
      })
      const err = result.some(item => { if (item) { return true }; return false })
      cb(err, this.state)
    }

    render () {
      const hocProps = {
        getFiledValue: this.getFiled,
        validate: this.validate,
        validateField: this.validateField
      }
      return <Comp hocProps={hocProps} />
    }
  }
}

class Form extends React.Component {
  onSubmit = () => {
    console.log('submit')
    // 校验所有项
    this.props.hocProps.validate((err, data) => {
      if (err) {
        //提交登录
        console.log('登录：', data)
        // 后续登录逻辑
      } else {
        alert('校验失败')
      }
    })
  }
  render () {
    const { getFiledValue } = this.props.hocProps
    return (
      <div>
        {getFiledValue('uname', {
          rules: [{ required: true, message: '用户名必填' }]
        })(<Input />)}

        {getFiledValue('pwd', {
          rules: [{ required: true, message: '密码必填' }]
        })(<Input type="password" />)}

        <Button onClick={this.onSubmit}>登录</Button>
      </div>
    )
  }

}

export default HocForm()(Form)