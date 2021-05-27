import React, { Component } from 'react'
import {Button,Card,List} from 'antd'
import {connect} from 'react-redux'
import {ArrowLeftOutlined} from '@ant-design/icons'
import './detail.less'
const {Item} = List
@connect(
    state => ({
        productList: state.productList,
        categoryList: state.categoryList
        })
)
class Detail extends Component {
    state = {
        pCategoryId:'',
        desc:'',
        detail:'',
        imgs:[],
        name:'',
        price:'',
        categoryName:''

    }
    componentDidMount() {
        const reduxProdList = this.props.productList
        const reduxCateList = this.props.categoryList
        const {id} = this.props.match.params
            let result = reduxProdList.find((item)=>{
                return item._id === id
            })
            if(result){
                this.pCategoryId = result.pCategoryId
                console.log(this.pCategoryId);
                this.setState({...result})
            }
            let cateResult = reduxCateList.find((item)=>{
                return item._id === this.pCategoryId
            })
            if(cateResult) {
                console.log(cateResult);
                this.setState({categoryName:cateResult.name})}
    }
    
    render() {
        
        return (
            <Card title={
            <div className='left-top'>
                <Button type="link" style={{fontSize: '20px'}} size="small" onClick={()=>this.props.history.goBack()}><ArrowLeftOutlined/></Button>
                <span>商品详情</span>
            </div>}>
                <List>
                    <Item className="list-item">
                        <span className="prod-name">商品名称：</span>
                        {this.state.name}
                    </Item>
                    <Item className="list-item">
                        <span className="prod-name">商品描述：</span>
                        {this.state.desc}
                    </Item>
                    <Item className="list-item">
                        <span className="prod-name">商品价格：</span>
                        {this.state.price}元
                    </Item>
                    <Item className="list-item">
                        <span className="prod-name">所属分类：</span>
                        {this.state.categoryName}
                    </Item>
                    <Item className="list-item">
                        <span className="prod-name">商品图片：</span>
                        {
                            this.state.imgs.map((item,index)=>{
                                return <img key={index} src={`/upload/`+item} alt="商品图片" style={{width:'200px'}}/>
                            })
                        }
                    </Item>
                    <Item className="list-item">
                        <span className="prod-name">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: this.state.detail} }></span>
                    </Item>
                </List>
                
            </Card>
        )
    }
}
export default Detail
