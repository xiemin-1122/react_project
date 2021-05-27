import React, { Component  } from 'react'
import {Card, Button, Table, message, Modal, Form,Input} from 'antd'
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux'
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'
import {reqCategoryList, reqAddCategory, reqUpdateCategory} from '../../api/index'
import {PAGE_SIZE} from '../../config/index'
const {Item} = Form
@connect(
    state=>({}),
    {saveCategoryInfo: createSaveCategoryAction}
)
class Category extends Component {
    formRef = React.createRef()
    state = {
        categoryList : [], //商品分类列表
        visiable: false,//控制弹窗的展示与否
        operType: '', //操作类型： 添加or修改
        isLoading: true,//显示是否正在加载
        modalCurrentValue: '',//弹窗显示的值，用于input框的数据回显
        modalCurrentId:'',// 
    }
    getCategoryList = async() => {
        let result = await reqCategoryList()
        this.setState({isLoading: false})
        const {status, data, msg} = result
        if(status===0){
            this.setState({categoryList: data.reverse()})
            // 把商品分类信息放入redux
            this.props.saveCategoryInfo(data)
        }else{
            message.error(msg, 1)
        }
    }
    componentDidMount() {
        // 页面一挂载就请求商品分类列表
        this.getCategoryList()
    }
    // 用于展示弹窗
    showModal = (type, item) => {
        this.setState({
            visiable: true, 
            operType:type,
            modalCurrentValue: '', 
            modalCurrentId:''
        }) 
            if(item){
                const{_id, name} = item
                this.setState({modalCurrentValue: name, modalCurrentId:_id})
            }      
        };
    // 新增分类的方法
    toAdd = async (values) => {
        let result = await reqAddCategory(values.categoryName, '0')
        const {status,data,msg} =  result
        if(status === 0) {
            message.success('新增商品分类成功！')
            let categoryList = [...this.state.categoryList]
            categoryList.unshift(data)
            this.setState({categoryList, visiable: false})
            this.formRef.current.resetFields()//重置表单
        }
        if(status === 1) message.error(msg, 1)
    }   
    toUpdate = async (categoryObj) => {
        let result = await reqUpdateCategory(categoryObj)
        const {status,msg} = result
        if(status === 0){
            message.success('更新分类名称成功', 1)
            this.getCategoryList()
            this.setState({visiable: false})
            this.formRef.current.resetFields()//重置表单
        }else{
            message.error(msg)
        }
    }
        // 点击弹窗ok按钮的回调
    handleOk = async() => {
        const {operType} = this.state
            try {
              const values = await this.formRef.current.validateFields();
              if(operType === '新增分类') this.toAdd(values)
              if(operType === '修改分类') {
                  const categoryObj = {
                      categoryId:this.state.modalCurrentId,
                      categoryName: values.categoryName
                  }
                  this.toUpdate(categoryObj)
              }
            } catch (errorInfo) {
              message.warn('提交校验失败')
            }  
        };
        // 点击弹窗取消按钮的回调
    handleCancel = () => {
        console.log(this.state);
        this.setState({visiable: false})
        // this.formRef.current.resetFields()
        };

    render() {
        const dataSource = this.state.categoryList;
          const columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
            //   key: 'age',
              render: (item) => {return <Button type="link"  onClick={()=>{this.showModal('修改分类', item)}}>修改分类</Button>},
              width: '25%',
              align:'center'                                                                                                             
            }
          ];
        return ( 
            <div>
                <Card extra={<Button type="primary" onClick={()=>{this.showModal('新增分类')}}><PlusOutlined /> 添加</Button>}>
                    <Table 
                    dataSource={dataSource} 
                    columns={columns} 
                    bordered={true} 
                    rowKey="_id" 
                    pagination={{pageSize:PAGE_SIZE, showQuickJumper:true}}
                    loading={this.state.isLoading}/>
                </Card>
                <Modal title={this.state.operType} 
                visible={this.state.visiable} 
                okText = "确定"
                cancelText = "取消"
                onOk={this.handleOk} 
                onCancel={this.handleCancel}
                destroyOnClose>
                    <Form name="normal_login" ref={this.formRef} className="login-form"  onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} >
                        <Item
                            name="categoryName"
                            initialValue = {this.state.modalCurrentValue}
                            rules={[
                              {required: true,message: '分类名必须输入!',},
                              ]}>
                            <Input placeholder="请输入分类名" />
                        </Item>
                        </Form>
                </Modal>
            </div>
            
        )
    }
}
export default Category
