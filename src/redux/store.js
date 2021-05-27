// 最核心的管理者

// 从redux中引入createStore，用于创建最核心的store对象
import {createStore, applyMiddleware} from 'redux'
// 引入reducer
import reducers from './reducers'
// 引入redux-thunk，用于支持异步函数
import thunk from 'redux-thunk'
// 引入redux-devtools-extension,用于支持redux开发者调试工具的运行
import {composeWithDevTools} from 'redux-devtools-extension'
// 暴露store 
export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))