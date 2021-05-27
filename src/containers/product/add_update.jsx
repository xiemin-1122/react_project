import React, { Component } from 'react'
import {Button, Card, Form, Input, message, Select} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {reqCategoryList, reqAddProduct, reqUpdateProduct} from '../../api/index'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'
const {Item} = Form
const {Option} = Select
@connect(
    state => ({categoryList: state.categoryList,
                productList: state.productList
                }),
    {}
)
class AddUpdate extends Component {
    formRef = React.createRef()
    picturesWallRef = React.createRef()
    richTextRef = React.createRef()
    state = {
        categoryList:[],//商品分类列表
        operaType: 'add',
        categoryId:'',
        pCategoryId:'',
        name:'',
        desc:'',
        price:'',
        detail:'',
        imgs:[],
        _id:''
    }
    getCategoryList = async() => {
        let result = await reqCategoryList()
        const {status, data, msg} = result
        if(status ===0 ) this.setState({categoryList: data})
        else message.error(msg)
    }
    componentDidMount() {
        const {categoryList} = this.props
        
        if(categoryList.length) this.setState({categoryList:categoryList})
        else this.getCategoryList()
        this.picturesWallRef.current.setFileList(this.state.imgs)
        this.richTextRef.current.setRichText(this.state.detail)

    }
    UNSAFE_componentWillMount(){
        const {id} = this.props.match.params
        const {productList} = this.props
        if(id) {
            this.setState({operaType:'update'})
            if(productList.length){
                let result = productList.find((item)=>{
                    return item._id === id
                }) 
                if(result) this.setState({...result})
                  
            }
        }
    }
    
    onFinish = async(event) => {
        const {operaType,_id, pCategoryId} = this.state
        // 从上传组件中获取已经上传的图片数组
        let imgs = this.picturesWallRef.current.getImgArr()
        // 从富文本组件中获取用户输入的文字转换为富文本的字符串
        let detail = this.richTextRef.current.getRichText()
        const values = await this.formRef.current.validateFields();
        let result
        if(operaType === 'add') result = await reqAddProduct({...values, imgs, detail})
        else result = await reqUpdateProduct({...values, _id, pCategoryId, imgs, detail})
        
        const {status, msg} = result
        if(status === 0) {
            message.success('操作成功')
            this.props.history.replace('/admin/prod_about/product')
        }
        else message.error(msg)
        
        
    }
    onFinishFailed = (params) => {
        
    }
    render() {
        const {operaType, name} = this.state
          const title = (
            <div className='left-top'>
                <Button type="link" size="small" onClick={()=>this.props.history.goBack()}><ArrowLeftOutlined/>返回</Button>
                <span>{operaType === 'update' ? '商品修改' : '商品添加'}</span>
            </div>
          )
        return (
            <Card title={title}>
                <Form 
                ref={this.formRef}
                labelCol={{md: 2}}
                wrapperCol={{lg: 5}}
                onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                <Item initialValue = {name || ''} label="商品名称" name ="name" rules={[{ required: true, message: '请输入商品名称' }]}>
                    <Input placeholder="商品名称"/>
                </Item>

                <Item initialValue = {this.state.desc || ''} label="商品描述" name="desc" rules={[{ required: true, message: '请输入商品描述' }]}>
                    <Input placeholder="商品描述"/>
                </Item>

                <Item initialValue = {this.state.price || ''} label="商品价格" name="price" rules={[{ required: true, message: '请输入商品价格' }]}>
                    <Input type="number" prefix="￥" addonAfter="元" placeholder="商品价格" />
                </Item>

                <Item initialValue = {this.state.pCategoryId || ''} label="商品分类" name="categoryId" rules={[{ required: true, message: '请输入商品分类' }]}>
                    <Select placeholder="请选择分类">
                        {
                            this.state.categoryList.map((item)=>{
                                return <Option key={item._id} value={item._id}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Item>

                <Item label="商品图片" wrapperCol={{lg: 8}}>
                    <PicturesWall ref={this.picturesWallRef}/>
                </Item>

                <Item label="商品详情" wrapperCol={{lg: 12}}>
                    <RichTextEditor ref={this.richTextRef}/>
                </Item>

                <Button type="primary" htmlType="submit">提交</Button>
                
                </Form>
            </Card>
        )
    }
}
export default AddUpdate