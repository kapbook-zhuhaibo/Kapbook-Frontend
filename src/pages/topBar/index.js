import { Component } from 'react';
import asyncComponent from '@/pages/common/asyncComponent.js';
import { connect } from 'dva';
import { path } from '@/utils/path';
import { Modal, Spin, message } from 'antd';
import styles from './index.scss';
import logoUrl from '@/assets/images/topBar/logo.png';
import Cookies from 'js-cookie'
const AsyncDropSup = asyncComponent(() => import('./dropSupMenus.js'));
const AsyncDropUser = asyncComponent(() => import('./dropUserMenus.js'));

@connect(({layouts, topBar}) => ({
    ...layouts,
    ...topBar,
}))

class Index extends Component{
    state={
        visible: false,
    }

    componentDidMount = () => {
        this.fnGetPendingNum();
        this.fnGetCompanyName();
    };
    
    render(){
        return(
            <div className={styles.topBar}>
                <img onClick={this.fnLocation.bind(this,path.return)} className={styles.logo} src={logoUrl} alt='' />
                
                {this.props.companyName !== '' ? 
                    <div onClick={this.fnToogleModal} className='fl companyDiv'>
                        <div className={styles.companyTitle}>{this.props.companyName}</div>
                        <div className={styles.companyChangeIco}></div>
                    </div>
                :null}
                
                <div className='fr'>
                    <div onClick={this.fnLocation.bind(this,path.url+'/user/pending')} className={styles.badgePadding}>
                        <div className={styles.badge}>
                            {this.props.pending_num !== 0 ? <div className={styles.badgeIco}>{this.props.pending_num}</div> : null}
                        </div>
                    </div>
                    
                    <AsyncDropSup />
                    
                    <AsyncDropUser />
                </div>

                <Modal
                    maskClosable={false}
                    title="企业切换"
                    visible={this.state.visible}
                    onCancel={this.fnToogleModal}
                    footer={false}
                    width={855}
                >
                    <Spin tip="Loading..." spinning={ this.props.companyList === '' ? true : false }>
                        <div className={styles.company_list}>
                            <ul>
                                {this.props.companyList !== '' ? this.props.companyList.map((item,index)=>{
                                    let surl = 'url('+item.company_icon+') no-repeat center';
                                    return(
                                        <li key={index} onClick={this.fnCompanyClick.bind(this, index, item)}>
                                            <dl>
                                                <dt style={{"background": surl,"backgroundSize":"100%"}}></dt>
                                                <dd>
                                                    {item.company_name !== '' ? 
                                                        <h3 title={item.company_name}>{item.company_name}</h3>
                                                    : 
                                                        <h3 title={item.full_name}>{item.full_name}</h3>
                                                    }
                                                </dd>
                                            </dl>
                                        </li>
                                    )
                                }):null}
                                <div className={styles.clear}></div>
                            </ul>
                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }

    fnLocation = url => {
        this.props.dispatch({type: 'layouts/getModelLocationCheck',callback:async function(){
            window.location.href=url;
        }});
    }

    fnGetCompanyName = () => {
        this.props.dispatch({type:'topBar/getModelCompanyName'})
    }

    fnGetPendingNum = () => {
        this.props.dispatch({type:'topBar/getModelPendingNum'})
    }

    fnToogleModal = () => { 
        this.setState({ visible: !this.state.visible }); 
        if( !this.state.visible && this.props.companyList === '' ){
            this.props.dispatch({type:'topBar/getModelCompanyList'});
        }
    }

    fnCompanyClick(index, item){
        let $this = this;
        this.props.dispatch({type: 'layouts/getModelLocationCheck',callback:async function(){
            if( $this.props.companyList[index].limitType === "0" ){
                message.error('您还没有权限管理公司');
            }else {
                Cookies.set( 'company_token',item.company_token, { domain: path.cookieUrl });
                window.location.href = path.return;
            }
        }});
    };


}
export default Index;