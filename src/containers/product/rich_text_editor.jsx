/*
用来指定商品详情的富文本编辑器组件
 */
import React, {Component} from 'react'
import {EditorState, convertToRaw, ContentState,} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component { 
  state = {
    editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
  }

  /*
  输入过程中实时的回调
   */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  getRichText = () => {
    // 返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  setRichText = (html) => {
    const contentBlock = htmlToDraft(html)
    if(contentBlock){
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.setState({editorState})
    }
  }
  render() {
    const {editorState} = this.state
    return (
        <div>
            <Editor
                editorState={editorState}
                // wrapperClassName="demo-wrapper"//最外侧样式
                // editorClassName="demo-editor"//编辑区域样式
                editorStyle={{
                    border: '1px solid black',
                    paddingLeft: '10px',
                    lineHight: '10px',
                    minHeight: '200px'
                }}
                onEditorStateChange={this.onEditorStateChange}
            />
            
        </div>
      
    )
  }
}