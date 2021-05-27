import React, { Component } from 'react'
import { Button, Modal } from 'antd';
import {withRouter} from 'react-router-dom'
import { FullscreenOutlined, FullscreenExitOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import {reqWeather} from '../../../api/index'
import './css/header.less'
import menuList from '../../../config/menu_config'
const {confirm} = Modal

// 在非路由组件中，要使用路由组件的api

@connect(
    state => ({
        userInfo:state.userInfo,
        title: state.title
    }),
    {deleteUserInfo: createDeleteUserInfoAction}
)
@withRouter
class Header extends Component {
    state = {
        isFull: false,
        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        weatherInfo:{},
        title:''
    }
    getWeather = async () => {
        let weatherInfo = await  reqWeather()
        this.setState({weatherInfo})
    }
    
    componentDidMount() {
        // 绑定监听
        screenfull.on('change', () => {
            let isFull = !this.state.isFull
            this.setState({isFull})
        })
        // 定时器更新时间
        this.time = setInterval(() => {
            this.setState({date: dayjs().format('YYYY-MM-DD HH:mm:ss')})           
        }, 1000);
        this.getWeather()
        // 展示当前菜单名称
        this.getTitle()
    }
    componentWillUnmount() {
        clearInterval(this.time)
    }
    

    fullScreen=() => {
        screenfull.toggle()
    }

    logout = () => {
        //  退出登录             
        confirm({
            title: '确定退出?',
            icon: <ExclamationCircleOutlined />,
            content: '若退出需要重新登陆',
            cancelText:'取消',
            okText: '确认',
            onOk: () => {
                this.props.deleteUserInfo() 
            }
          });        
         
     }

     getTitle = (params) => {
        let {pathname} = this.props.location
        let pathkey = pathname.split('/').reverse()[0]
        if(pathname.indexOf('product') !== -1) pathkey = 'product'
        let title = ''
        menuList.forEach((item) => {
            if(item.children instanceof Array){
                let tmp = item.children.find((item2) => {
                    return item2.key === pathkey
                })
                if(tmp) title = tmp.title
            }else{
                if(item.key === pathkey) title = item.title
            }
            
        })
        this.setState({title})
        
    }
    
    render() {
        let {isFull, date, weatherInfo, title} = this.state
        let {user} = this.props.userInfo
        return (
            <header className="header">
                <div className="header-top">
                    <Button size="small" onClick={this.fullScreen}>
                        {React.createElement(isFull ? FullscreenExitOutlined : FullscreenOutlined)} 
                    </Button>
                    <span className="username">欢迎，{user.username}</span>
                    <Button type="link" size="small" onClick={this.logout}>退出登录</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {this.props.title || title}
                    </div>
                    <div className="header-bottom-right">
                        {date}&nbsp;&nbsp;
                        {weatherInfo.weather}&nbsp;&nbsp;&nbsp;温度：{weatherInfo.temperature}
                    </div>
                </div>
            </header>
        )
    }
}
export default Header
