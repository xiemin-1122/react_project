import React, { Component } from 'react'
import {Button, Card, message,Table, Modal, Form, Input, Select} from 'antd'
import {PlusOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import {reqUserList, reqAddUser, reqUpdateUser, reqDeleteUser} from '../../api/index'
import {PAGE_SIZE} from '../../config/index'
import dayjs from 'dayjs'
const {Item} = Form
const {Option} = Select
const {confirm} = Modal
export default class User extends Component {
    formRef = React.createRef()
    state = {
        userList:[],
        roleList:[],
        isShowAdd: false,
        create_time:'',
        email:'',
        username: '',
        role_id:'',
        phone:'',
        _id:'',
        password:'',
        operType: 'add'
    }
    getUserList = async() => {
        let result = await reqUserList()
        const {status, data, msg} = result
        if(status === 0) this.setState({userList:data.users.reverse(), roleList: data.roles})
        else message.error(msg, 1)
    }
    componentDidMount() {
        this.getUserList()
    }
    toAddUser = async(userObj) => {
        let result = await reqAddUser(userObj)
            const {status, msg} = result
            if(status === 0){
                message.success('添加用户成功')
                this.setState({isShowAdd: false})
                this.getUserList()
        }
            else message.error(msg)
    }
    // 新增用户弹窗确定按钮的回调
    handleOk = async() => {
        try {
            const values = await this.formRef.current.validateFields()
            if(this.state.operType === 'add') this.toAddUser(values)
            else this.updateUser(values)            
        } catch (error) {
            message.error('表单校验失败！')
        }
    }
    // 新增用户弹窗取消按钮的回调
    handleCancel = () => {
        this.setState({isShowAdd: false})
    }
    // 修改用户
    updateUser = async(userObj) => {
        const {_id} = this.state
        const {username, phone, email,role_id} = userObj
        let result = await reqUpdateUser({_id,username,phone, email, role_id})
            const {status, msg} = result
            if(status === 0){
                message.success('修改用户成功')
                this.setState({isShowAdd: false})
                this.getUserList()
        }
            else message.error(msg)

        
    }

    //删除用户的弹窗
    showConfirm = (item) => {
        confirm({
          title: `你确定要删除${item.username}吗？`,
          icon: <ExclamationCircleOutlined />,
          onOk: async() => {
            let result = await reqDeleteUser(item._id)
            const {status, msg} = result
            if(status === 0){
                message.success('删除用户成功', 1)
                this.getUserList()
        }
            else message.error(msg, 1)
          },
          onCancel() {
            
          },
        });
      }
    render() {
        const dataSource = this.state.userList
          const columns = [
            {
              title: '用户名',
              dataIndex: 'username',
              key: 'username',
            },
            {
              title: '邮箱',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: '电话',
              dataIndex: 'phone',
              key: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
              },
              {
                title: '所属角色',
                dataIndex: 'role_id',
                key: 'role_id',
                render: (role_id) => {
                    let result = this.state.roleList.find((item) => {
                        return item._id === role_id
                    })
                    if(result) return result.name
                }
              },
              {
                title: '操作',
                // dataIndex: 'role_id',
                key: 'oper',
                render: (item) =>{
                    return (
                        <div>
                            <Button type="link" onClick={()=>{this.setState({...item, isShowAdd:true, operType: 'update'})}}>修改</Button>
                            <Button type="link" onClick={()=>{this.showConfirm(item)}}>删除</Button>
                        </div>
                    )
                }
              },
          ];
        return (
            <div>
                <Card  title={<Button type="primary" onClick={() => {this.setState({isShowAdd: true})}}><PlusOutlined />创建用户</Button>} >
                    <Table dataSource={dataSource} columns={columns} rowKey="_id"
                    bordered={true} 
                    pagination={{pageSize:PAGE_SIZE, showQuickJumper:true}}/>;
                </Card>
                <Modal title="添加用户"
                visible={this.state.isShowAdd} 
                okText = "确定"
                cancelText = "取消"
                onOk={this.handleOk} 
                onCancel={this.handleCancel}
                destroyOnClose>
                    <Form name="normal_login" ref={this.formRef} className="login-form"  onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} >
                    <Item initialValue={this.state.username || ''} label="用户名" name ="username" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input placeholder="请输入用户名"/>
                    </Item>

                        <Item initialValue={this.state.password || ''} label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                            {this.state.password ?<Input type="password" disabled/>: <Input placeholder="请输入密码"/>  }
                        </Item>

                        <Item initialValue={this.state.phone || ''} label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                            <Input placeholder="请输入手机号" />
                        </Item>
                        <Item initialValue={this.state.email || ''} label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
                            <Input placeholder="请输入邮箱" />
                        </Item>
                        <Item initialValue={this.state.role_id || ''} label="角色" name="role_id" rules={[{ required: true, message: '请选择一个角色' }]}>
                            <Select placeholder="请选择一个角色">
                                {
                                    this.state.roleList.map((item)=>{
                                        return <Option key={item._id} value={item._id}>{item.name}</Option>
                                    }) 
                                }
                            </Select>
                        </Item>
                        </Form>
                </Modal>
                
            </div>
        )
    }
}
