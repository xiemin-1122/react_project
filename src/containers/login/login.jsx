import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {createSaveUserInfoAction} from '../../redux/action_creators/login_action'
import './css/login.less'
import {reqLogin} from '../../api'
import logo from '../../static/imgs/logo.png'
const {Item} = Form

@connect(
    state => ({isLogin: state.userInfo.isLogin}),
    {
        saveUserInfo: createSaveUserInfoAction,
    }
)
class Login extends Component {
     
    onFinish = async(values) => {
        const {username,password} = values
        let result = await reqLogin(username,password)
        const {status,msg,data} = result
        if(status === 0){
            // 路由器返回的user信息，交由redux管理
            this.props.saveUserInfo(data)
            //用户名和密码都正确，登陆成功，跳转到admin页面
            this.props.history.replace('/admin/home')
        }else{
            message.warning(msg,1)
        }
    }


    onFinishFailed = (values, errorFields, outOfDate) => {
        message.error('表单输入有误，请检查！')
    }
    /* pwdValidator = (_, value) => {
        if(!value){
            return Promise.reject(new Error('密码必须输入'))
        }else if(value.length>12){
            return Promise.reject(new Error('密码必须小于等于12位'))
        }else if(value.length<4) {
            return Promise.reject(new Error('密码必须大于等于4位'))
        }else if(!(/^\w+$/).test(value)){
            return Promise.reject(new Error('密码必须是字母、数字、下划线组成'))
        }else{
            Promise.resolve()
        }
    } */
    render() {
        const {isLogin} = this.props
        // 如果已经登录了
        if(isLogin){
            return <Redirect to="/admin"/>
        }
        return (
            <div className="login">
                <header>
                    <img src={logo} alt="logo"/>
                    <h1>商品管理系统</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
                    <Form name="normal_login" className="login-form"  onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                        <Item
                            name="username"
                            rules={[
                              {required: true,message: '用户名必须输入!',},
                              {max: 12,message: '用户名必须小于等于12位'},
                              {min: 4,message: '用户名必须大于等于4位'},
                              {pattern: /^\w+$/,message: '用户名必须是字母、数字、下划线组成'}
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Item>
                        <Item
                            name="password"
                            // 自定义验证
                            rules={[
                            //   {validator: this.pwdValidator}
                            {required: true,message: '密码必须输入!',},
                              {max: 12,message: '密码必须小于等于12位'},
                              {min: 4,message: '密码必须大于等于4位'},
                              {pattern: /^\w+$/,message: '密码必须是字母、数字、下划线组成'}
                            ]}
                        >
                            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Item>
                        </Form>
                </section>
            </div>
        )
    }
}
export default Login