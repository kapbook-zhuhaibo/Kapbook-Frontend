import React, { Component } from 'react';
import './index.scss';
import { connect } from 'dva';
import { path } from '@/utils/path';

@connect(({layouts, topBar}) => ({
    ...layouts,
    ...topBar,
}))
class dropUserMenus extends Component {
    constructor(props){
        super(props);
        this.state={
            userDisplay:'none',
        }
    }

    componentDidMount = () => {
        this.requestGetUsers();
    };

    render(){
        return (
            <div className="fl dropSupport dropUserDiv">
                <div className="dropUsersDiv" onMouseOver={ this.fnMouseOverU } onMouseLeave={ this.fnMouseLeaveU }>
                    <div onClick={this.fnLocation.bind(this,path.url+'/user/user_index')} className="dropUsers">
                        <div className="userImgDiv">
                            <img src={ this.props.userImg } alt="" />
                        </div>
                        {this.props.userName}
                        <div className="downIcon"></div>
                    </div>
                    <ul style={{display: this.state.userDisplay}}>
                        <div className="barNavdivdownIcon"></div>
                        <li onClick={this.fnLocation.bind(this,path.url+'/user/user_index')}><span className="topbarUserIcon userinfoBtn"></span>个人信息</li>
                        <li onClick={this.fnLocation.bind(this,path.url+'/user/property')}> <span className="topbarUserIcon topbarmymoneyIcon"></span> 我的资产 </li>
                        <li onClick={this.fnLocation.bind(this,path.login)}> <span className="topbarUserIcon topbaroutIcon"></span> 退出登录 </li>
                    </ul>
                </div> 
            </div>
        )
    }
    fnLocation = url => { 
        this.props.dispatch({type: 'layouts/getModelLocationCheck',callback:async function(){
            window.location.href=url;
        }});
    }
    fnMouseOverU = () => { this.setState({ userDisplay:'block' }) }
    fnMouseLeaveU = () => { this.setState({ userDisplay:'none' }) }
    requestGetUsers = () => {
        this.props.dispatch({ type:'topBar/getModeltopBarUsers' });
    }
}

export default dropUserMenus;