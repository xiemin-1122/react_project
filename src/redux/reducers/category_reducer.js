import {SAVE_CATEGORY} from '../action_types'
let initState = []
export default function test(preState=initState, action) {  
    const {type, data} = action
    let newState
    switch(type){
        case SAVE_CATEGORY:
            newState = [...data]
            return newState
        default:
            return preState
    }
}