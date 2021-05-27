import React, { Component } from 'react'
import {Card,Button,Select, Input, Table, message} from 'antd'
import {connect} from 'react-redux'
import {PlusCircleOutlined, SearchOutlined} from '@ant-design/icons'
import {createSaveProductAction} from '../../redux/action_creators/product_action'
import {reqProductList, reqUpdateProdStatus, reqSearchProduct} from '../../api/index'
import {PAGE_SIZE} from '../../config/index'
const { Option } = Select;

@connect(
    state => ({}),
    {saveProduct: createSaveProductAction}
)
class Product extends Component {
    state = {
        productList:[], //商品分页列表
        total:0,//一共有多少数据
        current:1,//当前在哪一页
        keyWord: '',//搜索关键词
        searchType: 'productName'//搜索类型
    }
    componentDidMount() {
        this.getProductList()
    }
    getProductList = async (number=1) => {
        let result
        if(this.isSearch){
            const {keyWord, searchType} = this.state
            result = await reqSearchProduct(number, PAGE_SIZE, searchType, keyWord)
        }else{
            result = await reqProductList(number , PAGE_SIZE)
        }        
        const {status, data} = result
        if(status === 0){
            this.setState({
                productList: data.list.reverse(),
                total: data.total,
                current:data.pageNum
            })
            // 把获取的商品列表存入到redux中
            this.props.saveProduct(data.list)
        }else{
            message.error('获取商品列表失败')
        }
    }
    updateProdStatus = async({_id, status}) => {       
        let productList = [...this.state.productList]
        if(status === 1) status = 2
        else status = 1
        let result = await reqUpdateProdStatus(_id, status)
        if(result.status===0){
            message.success('更新商品状态成功',1)
            productList = productList.map((item)=>{
                console.log('item._id',item._id);
                if(item._id === _id){
                    item.status = status
                }
                return item
            })
            this.setState({productList})
        }
        else message.error('更新商品状态失败')
    }
    search = async() => {
        this.isSearch = true
        this.getProductList()
    }
    
    render() {
        const dataSource = this.state.productList        
          const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
              width: '18%',
              key: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
              key: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              align: 'center',
              key: 'price',
              width: '10%',
              render: price => '￥'+price
            },
            {
                title: '状态',
                // dataIndex: 'status', 
                align: 'center',
                // key: 'status',
                width: '10%',
                render: (item) => {
                    return (
                        <span>
                            <Button 
                            type={item.status === 1 ? 'danger' : "primary"}
                            onClick = {()=>{this.updateProdStatus(item)}}
                            >
                            {item.status===1 ? '下架' : '上架'}
                            </Button><br/>
                            <span>{item.status === 1 ? '在售' : '停售'}</span>
                        </span>
                    )
                }
              },
              {
                title: '操作',
                // dataIndex: 'opera',
                align: 'center',
                key: 'opera',
                width: '10%',
                render: (item) => {
                    return (
                        <div>
                            <Button type="link" 
                            onClick={()=>this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}
                            >
                            详情
                            </Button><br/>
                            <Button type="link" onClick={()=>this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}
                            >修改</Button>
                        </div>
                    )
                }
              },
          ];        
        return (
            <Card 
            title={
                <div>
                    <Select defaultValue="productName" onChange={(value)=>{this.setState({searchType:value})}}>
                        <Option value="productName">按名称搜索</Option>
                        <Option value="productDesc">按描述搜索</Option>
                    </Select>
                    <Input style={{margin: '0px 10px', width: '20%'}} 
                    placeholder="请输入搜索关键字" 
                    allowClear
                    onChange={(event)=>{this.setState({keyWord:event.target.value})}}/>
                    <Button type="primary" onClick={this.search}><SearchOutlined />搜索</Button>
                </div>

            }
            extra={<Button type="primary" onClick={()=>this.props.history.push('/admin/prod_about/product/add_update')}><PlusCircleOutlined />添加商品</Button>} 
            >
                <Table 
                dataSource={dataSource} 
                columns={columns} 
                rowKey='_id'
                bordered
                pagination={{
                    total: this.state.total,
                    pageSize: PAGE_SIZE,
                    current:this.state.current,
                    onChange:this.getProductList
                }}/>
            </Card>
        )
    }
}
export default Product
