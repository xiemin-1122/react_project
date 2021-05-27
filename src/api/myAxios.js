import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../redux/store'
import {createDeleteUserInfoAction} from '../redux/action_creators/login_action'
const instance = axios.create({
    timeout: 4000,
});

// 请求拦截器
instance.interceptors.request.use((config)=>{
    NProgress.start()
    const {method, data} = config
    // 若是post请求
    if(method.toLowerCase() === 'post'){
        // 若传递过来的参数是对象
        if(data instanceof Object){
            config.data = qs.stringify(data)
        }
        
    }
    return config
},  (error) => { 
    return Promise.reject(error);
 });

//  响应拦截器
instance.interceptors.response.use( (response)=> { 
    // 进度条结束
    NProgress.done()
    // 请求若成功，返回真正的数据
    return response.data;
},  (error) => { 
    // 进度条结束
    NProgress.done()
    if(error.response.status === 401){
        message.error('身份校验失败，请重新登录', 1)
        // 分发一个删除用户信息的action
        store.dispath(createDeleteUserInfoAction())
    }else{
        // 请求若失败，提示错误（这里可以处理所有请求的异常）
        message.error(error.message, 1)
    }
    
    // 中断Promise链
    return new Promise(() => {})
});

export default instance