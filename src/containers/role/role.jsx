import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button, Card, message, Table, Modal, Form, Input, Tree} from 'antd'
import dayjs from 'dayjs'
import {PlusOutlined} from '@ant-design/icons'
import {reqRoleList, reqAddRole, reqAuthRole} from '../../api/index'
import menuList from '../../config/menu_config'
import {PAGE_SIZE} from '../../config/index'
const {Item} = Form
const {TreeNode} = Tree
@connect(
    state => ({userName: state.userInfo.user.username}),
    {}
)
class Role extends Component {
    addFormRef = React.createRef()
    state={
        roleList: [],
        visiable: false,//控制新增角色表单显示与隐藏
        isShowAuth: false, //控制授权表单显示与隐藏
        _id:'',//当前操作的角色id
        checkedKeys: [],//默认选中的节点
        menuList:menuList
    }
    getRoleList = async() => {
        let result = await reqRoleList()
        const {status, data , msg} = result
        if(status === 0) {

            this.setState({roleList: data.reverse()})
        }
        else message.error(msg)
    }
    componentDidMount() {
        this.getRoleList()
    }
    // 用于展示弹窗
    showModal = () => {
        this.setState({
            visiable: true
        })                
        };

    addRole = async(roleName) => {
        let result = await reqAddRole(roleName)
        const {status,data, msg} = result
        if(status === 0) {
            message.success('添加角色成功')
            let roleList = [...this.state.roleList]
            roleList.unshift(data)
            this.setState({roleList, visiable: false})
    }
        else message.error(msg)
    }
    // 点击新增弹窗ok按钮的回调
    handleOk = async() => {
            try {
                const values = await this.addFormRef.current.validateFields();
                this.addRole(values.roleName)
                
            } catch (errorInfo) {
                message.warn('提交校验失败')
            }  
        };
     
    // 点击新增弹窗取消按钮的回调
    handleCancel = () => {
        this.setState({visiable: false})
        };
        // 用于展示授权弹窗
    showAuth = (role) => {
        console.log('role', role);
        this.setState({isShowAuth: true, _id:role._id, checkedKeys: role.menus})
    }
    // 点击授权弹窗ok按钮的回调
    handleAuthOk = async() => {
          const {_id, checkedKeys} = this.state
          const {userName} = this.props
          console.log({_id,menus:checkedKeys, auth_name: userName});
          let result = await reqAuthRole({_id,menus:checkedKeys, auth_name: userName })
          const {status, msg} = result
            if(status === 0) {
                message.success('授权成功', 1)
                this.setState({isShowAuth: false})
                this.getRoleList()
        } 
            else message.error(msg)
        };
 
    // 点击授权弹窗取消按钮的回调
    handleAuthCancel = () => {
        this.setState({isShowAuth: false})
        };
   
        
    onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
    };
        
    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
            }
            return <TreeNode key={item.key} {...item} />;
    });
        
    render() {
        const dataSource = this.state.roleList
          const columns = [
            {
              title: '角色名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
            },
            {
              title: '授权时间',
              dataIndex: 'auth_time',
              key: 'anth_time',
              render: time => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'anth_name',
              },
              {
                title: '操作',
                // dataIndex: 'auth_time',
                key: 'anth_time',
                render: (item) => {
                    return (<Button type="link" onClick={()=>{this.showAuth(item)}}>设置权限</Button>)
                }
                
              },
          ];
        //   treeData是树形菜单的原数据
        const treeData = this.state.menuList
          
          
        return (
            <div>
            <Card  title={<Button type="primary" onClick={this.showModal}><PlusOutlined />新增角色</Button>} >
                <Table dataSource={dataSource} columns={columns} rowKey="_id" bordered={true} 
                    pagination={{pageSize:PAGE_SIZE, showQuickJumper:true}}/>;
            </Card>
            {/* 新增角色表单 */}
            <Modal title="新增角色" 
            visible={this.state.visiable} 
            okText = "确定"
            cancelText = "取消"
            onOk={this.handleOk} 
            onCancel={this.handleCancel}
            destroyOnClose>
                <Form name="normal_login" ref={this.addFormRef} className="login-form"   >
                    <Item
                        name="roleName"
                        rules={[
                          {required: true,message: '角色名必须输入!',},
                          ]}>
                        <Input placeholder="请输入角色名" />
                    </Item>
                    </Form>
            </Modal>
            {/* 设置权限表单 */}
            <Modal title="设置权限" 
            visible={this.state.isShowAuth} 
            okText = "确定"
            cancelText = "取消"
            onOk={this.handleAuthOk} 
            onCancel={this.handleAuthCancel}
            destroyOnClose>
                 <Tree
                    checkable //允许选择
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}//已经选中的节点
                    defaultExpandAll={true}//默认展开所有父节点
                >
                    <TreeNode title="平台功能" key='top'>
                        {this.renderTreeNodes(treeData)}
                    </TreeNode>
                </Tree>
            </Modal>
            </div>
        )
    }
}
export default Role
