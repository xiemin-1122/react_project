import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu} from 'antd';
import {connect} from 'react-redux'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'
import logo from '../../../static/imgs/logo.png'
import './left_nav.less'
import menuList from '../../../config/menu_config'
const { SubMenu } = Menu;
@connect(
  state => ({
    menus: state.userInfo.user.role.menus,
    username: state.userInfo.user.username
  }),
  {
    saveTitle:createSaveTitleAction
  }
)
@withRouter
class LeftNav extends Component {
  // 校验菜单权限
  hasAuth = (item) => {
     const {menus, username} = this.props
     if(username === 'admin') return true
     else if(!item.children) return menus.find((item2)=>item2===item.key)
     else if(item.children) return item.children.some(item3=> {return menus.indexOf(item3.key) !== -1})
  }
  // 用于创建菜单的函数
    createMenu = (target) => {
      return target.map((item) => {
         if(this.hasAuth(item)){
          if(!item.children){
            return (
              <Menu.Item onClick={()=>{this.props.saveTitle(item.title)}} key={item.key} icon={item.icon}>
                  <Link to={item.path}>
                    {item.title}
                  </Link>
              </Menu.Item>
      
            )
          }else{
            return(
              <SubMenu key={item.key} icon={item.icon} title={item.title}>
                {this.createMenu(item.children)}
              </SubMenu>
            )
          }
      }
      })
    }
    state = {
        collapsed: false,
      };
    
      toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      };

      render() {
        let {pathname} = this.props.location
        return (
          <div>
              <header className="nav_header">
                  <img src={logo} alt=""/>
                  <h1>商品管理系统</h1>
              </header>
                <Menu
                selectedKeys={[(pathname.indexOf('product')!== -1) ? 'product' : pathname.split('/').reverse()[0]]}
                defaultOpenKeys={pathname.split('/').splice(2)}
                mode="inline"
                theme="dark"
                // collapsed={this.state.collapsed}
                >
                {
                  this.createMenu(menuList)
                }
                
                </Menu>
              </div>
        );
      }
}
export default LeftNav
