// 项目中所有请求由这个文件发出
import myAxios from './myAxios'
import jsonp from 'jsonp'
import {message} from 'antd'
import {BASE_URL, GAODE_KEY, CITY} from '../config/index'
// 登录请求
export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, {username, password})
// 获取商品分类列表请求
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`)

// 获取天气信息
export const reqWeather = () => {
    return new Promise((resolve, reject)=>{
        jsonp(`https://restapi.amap.com/v3/weather/weatherInfo?city=${CITY}&key=${GAODE_KEY}`, (err,data) => {
        if(err){
            message.error('请求天气接口失败，请联系管理员')
            return new Promise(() => {})
        }else{
            const {temperature, weather} = data.lives[0]
             let result = {temperature, weather}
             resolve(result)
        }
    } )
    })
}

// 新增商品的一级分类
export const reqAddCategory = (categoryName,parentId) => myAxios.post(`${BASE_URL}/manage/category/add`, {categoryName,parentId})
// 更新商品分类名称
export const reqUpdateCategory = ({categoryId,categoryName}) => myAxios.post(`${BASE_URL}/manage/category/update`, {categoryId,categoryName})
// 请求商品分页列表
export const reqProductList = (pageNum,pageSize) => myAxios.get(`${BASE_URL}/manage/product/list`, {params:{pageNum,pageSize}})
// 请求更新商品在售状态
export const reqUpdateProdStatus = (prodctId,status) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`, {prodctId,status})
// 搜索商品
export const reqSearchProduct = (pageNum, pageSize, searchType, keyWord) => myAxios.get(`${BASE_URL}/manage/product/search`, {params:{pageNum,pageSize, [searchType]:keyWord}})
// 根据图片唯一名字删除图片
export const reqDeletePicture = (name) => myAxios.post(`${BASE_URL}/manage/img/delete`, {name})
// 请求添加商品
export const reqAddProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/add`, {...productObj, pCategoryId:'0'})
// 请求修改商品信息
export const reqUpdateProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/update`, {...productObj})
// 请求角色列表
export const reqRoleList = () => myAxios.get(`${BASE_URL}/manage/role/list`)
// 请求添加角色
export const reqAddRole = (roleName) => myAxios.post(`${BASE_URL}/manage/role/add`, {roleName})
// 请求更新角色（给角色设置权限）
export const reqAuthRole = (roleObj) => myAxios.post(`${BASE_URL}/manage/role/update`, {...roleObj, auth_time: Date.now()})
// 请求用户列表
export const reqUserList = () => myAxios.get(`${BASE_URL}/manage/user/list`)
// 请求添加用户
export const reqAddUser = (userObj) => myAxios.post(`${BASE_URL}/manage/user/add`, {...userObj})
// 请求修改用户
export const reqUpdateUser = (userObj) => myAxios.post(`${BASE_URL}/manage/user/update`, {...userObj})
// 请求删除用户
export const reqDeleteUser = (userId) => myAxios.post(`${BASE_URL}/manage/user/delete`, {userId})
