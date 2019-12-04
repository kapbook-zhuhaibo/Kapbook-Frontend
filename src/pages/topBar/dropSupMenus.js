import React, { Component } from 'react';
import { Modal,Input, message } from 'antd';
import styles from './index.scss';
import { path } from '@/utils/path';

const { TextArea } = Input;

class DropSup extends Component {
    constructor(props){
      super(props);
      this.state={
        supDisplay:'none',
        visible: false,
        TextAreaContent:"",
        customUrl:'',
        customDisplan:'none'
      }
    }

    fnMouseOver = () => { if( this.state.customUrl === '' ){ this.setState({ supDisplay:'block' }) } }
    fnMouseLeave = () => { this.setState({ supDisplay:'none' }) }
    fnTextArea=(e)=>{ this.setState({ TextAreaContent:e.target.value }); }
    showModal = () => { this.setState({ visible: true,supDisplay:'none' }); };
    handleOk (){
        if( this.state.TextAreaContent === "" ){
            message.warning('反馈内容为空');
        }else {
            this.setState({
                visible: false,
                supDisplay:'none',
                TextAreaContent:''
            });
        }
    };
    hideModal = () => { this.setState({ visible: false,supDisplay:'none' }); };
    fnLocation = url => { window.open(url,"_blank"); }
    customHide = () => { this.setState({ customDisplan:'none', customUrl:'' }); }
    customShow = () => {
        this.setState({
            customDisplan:'block',
            customUrl:'//a1.7x24cc.com/phone_webChat.html?accountId=N000000008441&chatId=yxcw-11273760-847d-11e6-8a4e-af4fab039769'
        });
    }
    render(){
        return (
            <div className={styles.dropSupport} onMouseOver={ this.fnMouseOver } onMouseLeave={ this.fnMouseLeave }>
                技术支持
                <div className={styles.downIcon}></div>
                <ul style={{ 'display':this.state.supDisplay }} >
                    <div className={styles.barNavdivdownIcon}></div>
                    <li onClick={this.fnLocation.bind(this,path.url+'/support/index?show_page=1')}><span className={`${styles.helpIcon} ${styles.helpBtn}`}></span>帮助</li>
                    <li onClick={this.showModal}><span className={`${styles.helpIcon} ${styles.feedbackBtn}`}></span> 反馈</li>
                    <li onClick={this.customShow}><span className={`${styles.helpIcon1} ${styles.feedbackBtn}`}></span>客服</li>
                </ul>
                <Modal
                    title="反馈"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.hideModal}
                    okText='提交建议'
                    cancelText='关闭'
                    forceRender={ true }
                    maskClosable={false}
                    destroyOnClose={true}
                    >
                    <p>欢迎您写下对此页面的想法和建议，便于我们更快地发现和解决问题。</p>
                    <p>
                        <TextArea style={{ height:"200px" }} defaultValue={ this.state.TextAreaContent } onChange={ this.fnTextArea }></TextArea>
                    </p>
                </Modal>
                <div className={styles.customSer} style={{display:this.state.customDisplan}}>
                    <span onClick={this.customHide} className={styles.whitedelico}>X</span>
                    <iframe title='customIframe' src={this.state.customUrl} style={{width:350,height:480}} frameBorder={'0'} />
                </div>
            </div>
        )
    }
}

export default DropSup;