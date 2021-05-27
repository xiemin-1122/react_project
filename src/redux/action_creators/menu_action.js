import {SAVE_TITLE} from '../action_types'
export const createSaveTitleAction = (value) => {
    localStorage.setItem('title', JSON.stringify(value))
    return {type: SAVE_TITLE, data:value}
}
